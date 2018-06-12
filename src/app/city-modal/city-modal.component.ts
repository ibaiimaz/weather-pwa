import { Component, EventEmitter, Input, Output, ViewChild, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ModalComponent } from 'ngx-boot-modal';

@Component({
  selector: 'app-city-modal',
  templateUrl: './city-modal.component.html',
  styleUrls: ['./city-modal.component.css']
})
export class CityModalComponent implements OnInit {
  form: FormGroup;
  cities = [{id: '2357536', name: 'Austin, TX'},
            {id: '2367105', name: 'Boston, MA'},
            {id: '2379574', name: 'Chicago, IL'},
            {id: '2459115', name: 'New York, NY'},
            {id: '2475687', name: 'Portland, OR'},
            {id: '2487956', name: 'San Francisco, CA'},
            {id: '2490383', name: 'Seattle, WA'}];
  @Output() add = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();
  @ViewChild(ModalComponent) modal: ModalComponent;

  constructor(
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      city: ['']
    });
  }

  open() {
    this.modal.open();
  }

  onCancel() {
    this.modal.close();
    this.cancel.emit();
  }

  onAdd() {
    const city = this.cities.find(c => c.id === this.form.get('city').value);
    this.modal.close();
    this.add.emit(city);
  }
}
