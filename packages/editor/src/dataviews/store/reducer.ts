/**
 * WordPress dependencies
 */
import { combineReducers } from '@wordpress/data';
import type { Action, Field } from '@wordpress/dataviews';

type ReduxAction =
	| ReturnType< typeof import('./private-actions').registerEntityAction >
	| ReturnType< typeof import('./private-actions').unregisterEntityAction >
	| ReturnType< typeof import('./private-actions').registerEntityField >
	| ReturnType< typeof import('./private-actions').unregisterEntityField >
	| ReturnType< typeof import('./private-actions').setIsReady >;

export type ActionState = Record< string, Record< string, Action< any >[] > >;
export type FieldsState = Record< string, Record< string, Field< any >[] > >;
export type ReadyState = Record< string, Record< string, boolean > >;
export type State = {
	actions: ActionState;
	fields: FieldsState;
	isReady: ReadyState;
};

function isReady( state: ReadyState = {}, action: ReduxAction ) {
	switch ( action.type ) {
		case 'SET_IS_READY':
			return {
				...state,
				[ action.kind ]: {
					...state[ action.kind ],
					[ action.name ]: true,
				},
			};
	}

	return state;
}

function actions( state: ActionState = {}, action: ReduxAction ) {
	switch ( action.type ) {
		case 'REGISTER_ENTITY_ACTION':
			return {
				...state,
				[ action.kind ]: {
					...state[ action.kind ],
					[ action.name ]: [
						...(
							state[ action.kind ]?.[ action.name ] ?? []
						).filter(
							( _action ) => _action.id !== action.config.id
						),
						action.config,
					],
				},
			};
		case 'UNREGISTER_ENTITY_ACTION': {
			return {
				...state,
				[ action.kind ]: {
					...state[ action.kind ],
					[ action.name ]: (
						state[ action.kind ]?.[ action.name ] ?? []
					).filter( ( _action ) => _action.id !== action.actionId ),
				},
			};
		}
	}

	return state;
}

function fields( state: FieldsState = {}, action: ReduxAction ) {
	switch ( action.type ) {
		case 'REGISTER_ENTITY_FIELD':
			return {
				...state,
				[ action.kind ]: {
					...state[ action.kind ],
					[ action.name ]: [
						...(
							state[ action.kind ]?.[ action.name ] ?? []
						).filter(
							( _field ) => _field.id !== action.config.id
						),
						action.config,
					],
				},
			};
		case 'UNREGISTER_ENTITY_FIELD':
			return {
				...state,
				[ action.kind ]: {
					...state[ action.kind ],
					[ action.name ]: (
						state[ action.kind ]?.[ action.name ] ?? []
					).filter( ( _field ) => _field.id !== action.fieldId ),
				},
			};
	}

	return state;
}

export default combineReducers( {
	actions,
	fields,
	isReady,
} );
