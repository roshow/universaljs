import WingRankerConstants from './../constants/WingRankerConstants';
import WingRankerUtils from './../utils/WingRankerUtils.js';
import AppDispatcher from './../dispatcher/AppDispatcher';
import EventEmitter from 'events';

const CHANGE_EVENT = 'change';

var matches = [];
var settings = {
	scoringType: 'official',
};


var MatchStore = Object.assign({}, EventEmitter.prototype, {

  emitChange () {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener (callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

	getFirst: () => matches[0],

	getAll: () => matches,

	getSettings: () => settings,

	getMatches: () => matches,

});


MatchStore.dispatchToken = AppDispatcher.register( action => {

  switch(action.type) {
    case WingRankerConstants.DAMAGE_RECORDED:
    	var { damage, match, player, ship } = action;
    	var {
			  [match]: {
			    players: {
			      [player]: {
			        damage_taken
			      }
			    }
			  }
			} = matches;
			damage_taken[ship] = damage;
			// matches[match].points = WingRankerUtils.calcMatchPoints(matches[match], players);
      MatchStore.emitChange();
      break;

    case WingRankerConstants.SCORINGTYPE_CHANGED:

      settings.scoringType = action.scoringType;

      MatchStore.emitChange();

      break;

    case WingRankerConstants.MATCHES_LOADED:
    	matches = action.matches;
	    MatchStore.emitChange();
    	break;
  }
});

export default MatchStore;
