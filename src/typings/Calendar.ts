import { AssetDBO } from "@helpfulhuman/expapp-shared-libs";
import { ViewApi } from "@fullcalendar/react";

export interface ICalendarEventContent {
  event: {
    start: Date;
    url?: string;
    _def: {
      extendedProps: {
        customUrl?: string;
        imageUrl?: string | AssetDBO;
        paymentType?: string;
        price?: [string, number];
        uuid: string;
        pastEvent: boolean;
      };
      title: string;
    };
  };
}

export type DateClickEvent = {
  dateStr: string;
  date: Date;
  allDat: boolean;
  jsEvent: MouseEvent;
  view: ViewApi;
  dayEl: HTMLElement;
};

export type CalendarEventClick = {
  jsEvent: MouseEvent;
  event: {
    _def: {
      extendedProps: {
        uuid: string;
      }
      publicId: string;
      title: string;
    };
    _instance: {
      range: {
        start: Date;
        end: Date;
      };
    };
  }
};