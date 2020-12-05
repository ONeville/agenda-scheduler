import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import * as moment from 'moment';

export interface CalendarDate {
  mDate: moment.Moment;
  selected?: boolean;
  today?: boolean;
}

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent implements OnInit, OnChanges {
  public currentDate: moment.Moment;
  public nextMonthDate: moment.Moment;
  public namesOfDays = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
  public namesOfDays2 = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  public weeks: Array<CalendarDate[]> = [];
  public selectedDate: string;
  public nextMonthWeeks: Array<CalendarDate[]> = [];
  public currentDateString: string;
  public currentWeek: CalendarDate[];

  public data: {
    name: string;
    date: Date;
    startTime: Date;
    endTime: Date;
    status: string;
  }[] = [];

  @Input() public shouldRefresh: boolean;
  @Output() public dateChange = new EventEmitter<string>();

  // private _startDate: Date;
  // private _endDate: Date;

  // @Input() public set startDate(date: string | Date) {
  //   if (date) {
  //     this._startDate = this.parseDate(date);
  //     this._startDate.setDate(this._startDate.getDate() - 1);
  //   }
  // }

  // @Input() public set endDate(date: string | Date) {
  //   if (date) {
  //     this._endDate = this.parseDate(date);
  //     this._endDate.setDate(this._endDate.getDate() + 1);
  //   }
  // }

  // @Input() public set initialSelectedDate(date: string) {
  //   if (date) {
  //     this.selectDate({
  //       mDate: moment(date),
  //     });
  //   }
  // }

  constructor() {}

  ngOnInit(): void {
    this.currentDate = moment();
    this.nextMonthDate = moment(this.currentDate).add(1, 'months');
    this.generateCalendar();
    this.currentDateString = this.currentDate.toLocaleString();
  }

  ngOnChanges(changes: SimpleChanges): void {}

  public goNext() {}
  public goPrevious() {}

  public isDisabledMonth(date: moment.Moment): boolean {
    const today = moment();
    return moment(date).isBefore(today, 'months');
  }

  public isSameMonth(date: moment.Moment): boolean {
    return moment(date).isSame(this.currentDate, 'month');
  }

  public isSameNextMonth(date: moment.Moment): boolean {
    return moment(date).isSame(this.nextMonthDate, 'month');
  }

  // public isInRange(date: moment.Moment): boolean {
  //   return moment(date).isBetween(
  //     moment(this._startDate),
  //     moment(this._endDate)
  //   );
  // }

  public selectDate(date: CalendarDate) {
    this.selectedDate = date.mDate.format('YYYY-MM-DD');
    this.generateCalendar();
    this.dateChange.emit(this.selectedDate);
  }

  public getDayLabel(day: moment.Moment) {
    return this.namesOfDays2[day.toDate().getDay()];
  }

  public availability(day: CalendarDate) {
    return moment().isSameOrBefore(moment(day.mDate), 'day');
  }
  public getDataSource() {
    for (const item of this.currentWeek) {
      const tasks = this.getRandomArbitrary(1, 3);
      for (let index = 0; index < tasks; index++) {
        const time = this.getRandomArbitrary(6, 12);
        const startTime = item.mDate.toDate();
        startTime.setHours(time);
        const endTime = item.mDate.toDate();
        endTime.setHours(time + this.getRandomArbitrary(1, 6));
        const itemDate = {
          name: 'Shift Offered',
          date: item.mDate.toDate(),
          startTime,
          endTime,
          status: 'active',
        };
        this.data.push(itemDate);
      }
    }
  }

  public getEvent(date: Date) {
    return this.data.filter((x) => x.date.getTime() === date.getTime());
  }

  private getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  // private isSelectedDateValid(): boolean {
  //   if (!this.selectedDate) {
  //     return true;
  //   }

  //   const timeOfSelectedDate = this.parseDate(this.selectedDate).getTime();
  //   return (
  //     timeOfSelectedDate > this._startDate.getTime() &&
  //     timeOfSelectedDate < this._endDate.getTime()
  //   );
  // }

  private generateCalendar(): void {
    this.weeks = this.fillWeekDays(this.currentDate);
    this.currentWeek = this.weeks[0];
    this.getDataSource();
  }

  private fillWeekDays(currentMoment: moment.Moment) {
    const dates = this.fillDates(currentMoment);
    const weeks = [];
    while (dates.length > 0) {
      weeks.push(dates.splice(0, 7));
    }
    return weeks;
  }

  private fillDates(currentMoment: moment.Moment) {
    const firstOfMonth = moment(currentMoment).startOf('month').day();
    const lastOfMonth = moment(currentMoment).endOf('month').day();

    const firstDayOfGrid = moment(currentMoment)
      .startOf('month')
      .subtract(firstOfMonth, 'days');
    const lastDayOfGrid = moment(currentMoment)
      .endOf('month')
      .subtract(lastOfMonth, 'days')
      .add(7, 'days');

    const rangeDates = this.rangeDates(firstDayOfGrid, lastDayOfGrid, 'days');
    return rangeDates.map((date) => {
      return {
        today: this.isToday(date),
        selected: this.isSelected(date),
        mDate: date,
      };
    });
  }
  private isToday(date: moment.Moment): boolean {
    return moment().isSame(moment(date), 'day');
  }

  private isSelected(date: moment.Moment): boolean {
    return this.currentDate
      ? this.selectedDate === moment(date).format('YYYY-MM-DD')
      : false;
  }

  private range(start, end) {
    return Array.from({ length: end - start + 1 }, (_, i) => i);
  }

  private rangeDates(startDate, endDate, type) {
    const fromDate = moment(startDate);
    const toDate = moment(endDate);
    const diff = toDate.diff(fromDate, type);
    const range = [];
    for (let i = 0; i < diff; i++) {
      range.push(moment(startDate).add(i, type));
    }
    return range;
  }

  private parseDate(date: string | Date): Date {
    if (typeof date === 'string') {
      const dateDigits = date.split('T')[0].split('-');
      return new Date(+dateDigits[0], +dateDigits[1] - 1, +dateDigits[2]);
    }
    return date;
  }
}
