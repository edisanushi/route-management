import { createReducer, on } from '@ngrx/store';
import { PricingActions } from './pricing.actions';
import { PricingState } from '../models/pricing.models';

const initialState: PricingState = {
  assignedRoutes: [],
  assignedRoutesLoading: false,
  rows: [],
  tableLoading: false,
  saving: false,
  error: null,
  origin: "",
  destination: "",
  seasonName: "",
  selectedTourOperatorId: null
};

export const pricingReducer = createReducer(
  initialState,

  on(PricingActions.loadAssignedRoutes, state => ({ ...state, assignedRoutesLoading: true, error: null })),
  on(PricingActions.loadAssignedRoutesSuccess, (state, { routes }) => ({ ...state, assignedRoutesLoading: false, assignedRoutes: routes })),
  on(PricingActions.loadAssignedRoutesFailure, (state, { error }) => ({ ...state, assignedRoutesLoading: false, error })),

  on(PricingActions.loadAssignedRoutesByOperator, state => ({ ...state, assignedRoutesLoading: true, error: null })),
  on(PricingActions.loadAssignedRoutesByOperatorSuccess, (state, { routes }) => ({ ...state, assignedRoutesLoading: false, assignedRoutes: routes })),
  on(PricingActions.loadAssignedRoutesByOperatorFailure, (state, { error }) => ({ ...state, assignedRoutesLoading: false, error })),

  on(PricingActions.loadPricingTable, state => ({ ...state, tableLoading: true, error: null })),
  on(PricingActions.loadPricingTableSuccess, (state, { data }) => ({
    ...state,
    rows: data.rows,
    origin: data.origin,
    destination: data.destination,
    seasonName: data.seasonName,
    tableLoading: false
  })),

  on(PricingActions.loadPricingTableFailure, (state, { error }) => ({ ...state, tableLoading: false, error })),

  on(PricingActions.upsertPricing, state => ({ ...state, saving: true, error: null })),
  on(PricingActions.upsertPricingSuccess, state => ({ ...state, saving: false })),
  on(PricingActions.upsertPricingFailure, (state, { error }) => ({ ...state, saving: false, error })),

  on(PricingActions.updateCell, (state, { date, bookingClassId, field, value }) => ({
    ...state,
    rows: state.rows.map(row => {
      if (row.date.substring(0, 10) !== date.substring(0, 10)) return row;
      return {
        ...row,
        bookingClassPricings: row.bookingClassPricings.map(bcp => {
          if (bcp.bookingClassId !== bookingClassId) return bcp;
          return { ...bcp, [field]: value };
        })
      };
    })
  })),

  on(PricingActions.applyBulkFill, (state, { scope, bookingClassId, price, seatsRequested, fromDate, toDate, daysOfWeek }) => ({
    ...state,
    rows: state.rows.map(row => {
      const rowDate = new Date(row.date);
      const matches = (() => {
        if (scope === 'all') return true;
        if (scope === 'dateRange' && fromDate && toDate) {
          const from = new Date(fromDate);
          const to = new Date(toDate);
          return rowDate >= from && rowDate <= to;
        }
        if (scope === 'daysOfWeek' && daysOfWeek?.length) {
          return daysOfWeek.includes(row.dayOfWeek);
        }
        return false;
      })();
      if (!matches) return row;
      return {
        ...row,
        bookingClassPricings: row.bookingClassPricings.map(bcp => {
          if (bcp.bookingClassId !== bookingClassId) return bcp;
          return { ...bcp, price, seatsRequested };
        })
      };
    })
  })),

  on(PricingActions.clearPricingTable, (state) => ({
    ...state,
    rows: [],
    origin: '',
    destination: '',
    seasonName: '',
  })),

  on(PricingActions.setSelectedTourOperator, (state, { tourOperatorId }) => ({
    ...state,
    selectedTourOperatorId: tourOperatorId
  }))

);