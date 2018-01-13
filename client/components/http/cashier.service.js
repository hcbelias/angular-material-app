"use strict";

export default function CashierResource($resource) {
  "ngInject";

  return $resource(
    "/api/cashiers/:id/:controller/:subcontroller",
    {
      id: "@_id"
    },
    {
      finalizeSale: {
        method: "POST",
        params: {
          id: "@id",
          controller: "sales"
        }
      },
      getCashiersReportData: {
        method: 'GET',
        params: {
          id: '@id',
          start: 'start',
          end: 'end',
          controller: 'report',
          subcontroller: 'cashier'
        },
        isArray: true
      },
      getPaymentsReportData: {
        method: 'GET',
        params: {
          id: '@id',
          start: 'start',
          end: 'end',
          controller: 'report',
          subcontroller: 'payment'
        },
        isArray: true
      },
      getKegsReportData: {
        method: 'GET',
        params: {
          id: '@id',
          start: 'start',
          end: 'end',
          controller: 'report',
          subcontroller: 'keg'
        },
        isArray: true
      },
      getSalesReportData: {
        method: 'GET',
        params: {
          id: '@id',
          start: 'start',
          end: 'end',
          controller: 'report',
          subcontroller: 'sales'
        },
        isArray: true
      },
    }
  );
}
