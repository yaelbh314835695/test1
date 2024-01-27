import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import * as MOCK_DATA from '../data/MOCK_DATA.json';

export interface Users {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  account_id: string;
}

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  animations: [
    trigger('detailExpand', [
      state(
        'collapsed',
        style({ height: '0px', minHeight: '0', display: 'none' })
      ),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class UsersComponent implements OnInit, AfterViewInit {
  searchUserForm1: FormGroup;
  emailRegx =
    /^(([^<>+()\[\]\\.,;:\s@"-#$%&=]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,3}))$/;

  filteredRequests: Users[];
  data: any;
  displayedColumns: string[] = [
    'id',
    'firstName',
    'lastName',
    'email',
    'account_id',
  ];
  dataSource = new MatTableDataSource<Users>(MOCK_DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private formBuilder: FormBuilder) {}
  ngOnInit() {
    this.data = this.dataSource.filteredData;
    this.dataSource.data = Object.values(this.data);

    this.searchUserForm1 = this.formBuilder.group({
      id: [null, Validators.pattern('^[0-9]*$')],
      firstName: [null, Validators.pattern('[a-zA-Z]+')],
      lastName: [null, Validators.pattern('[a-zA-Z]+')],
      email: [null, Validators.pattern(this.emailRegx)],
      accountId: [null, Validators.pattern('^[0-9]{2}-[0-9]{7}$')],
    });
  }

  getAllUsers() {
    this.dataSource.data = Object.values(this.data);
  }

  searchDisabled(): Boolean {
    return (this.searchUserForm1.controls?.id.value &&
      this.searchUserForm1.controls?.id.valid) ||
      (this.searchUserForm1.controls?.firstName.value &&
        this.searchUserForm1.controls?.firstName.valid) ||
      (this.searchUserForm1.controls?.lastName.value &&
        this.searchUserForm1.controls?.lastName.valid) ||
      (this.searchUserForm1.controls?.email.value &&
        this.searchUserForm1.controls?.email.valid) ||
      (this.searchUserForm1.controls?.accountId.value &&
        this.searchUserForm1.controls?.accountId.valid)
      ? false
      : true;
  }

  submit() {
    if (!this.searchUserForm1.valid) {
      return;
    }
    this.requestFilter(this.searchUserForm1.value);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  requestFilter(value: Object) {
    this.dataSource.data = this.performFilter(value);
  }

  performFilter(filterBy: any): Users[] {
    this.filteredRequests = [];
    this.dataSource?.data.filter((request: Users) => {
      if (
        (!filterBy.id || request.id == filterBy.id) &&
        (!filterBy.firstName ||
          request.first_name?.toLocaleLowerCase().includes(filterBy.firstName?.toLocaleLowerCase())) &&
        (!filterBy.lastName || request.last_name?.toLocaleLowerCase().includes(filterBy.lastName?.toLocaleLowerCase())) &&
        (!filterBy.email || request.email?.toLocaleLowerCase().includes(filterBy.email?.toLocaleLowerCase())) &&
        (!filterBy.accountId || request.account_id == filterBy.accountId)
      ) {
        this.filteredRequests.push(request);
      }
    });
    return filterBy && this.filteredRequests.length >= 0
      ? this.filteredRequests
      : this.data[0];
  }
}
// request.first_name?.toLocaleLowerCase().includes(filterBy)