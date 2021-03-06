class SessionHistoryMenu {

  constructor() {
    this.restrict = "E";
    this.templateUrl = "directives/session-history-menu.html";
    this.scope = {
      item: "="
    };
  }

  controller($scope, modelManager, sessionHistory, actionsManager, $timeout) {
    'ngInject';

    $scope.diskEnabled = sessionHistory.diskEnabled;
    $scope.autoOptimize = sessionHistory.autoOptimize;

    $scope.reloadHistory = function() {
      let history = sessionHistory.historyForItem($scope.item);
      // make copy as not to sort inline
      $scope.entries = history.entries.slice(0).sort((a, b) => {
        return a.item.updated_at < b.item.updated_at ? 1 : -1;
      })
      $scope.history = history;
    }
    
    $scope.reloadHistory();

    $scope.openRevision = function(revision) {
      actionsManager.presentRevisionPreviewModal(revision.item.uuid, revision.item.content);
    }

    $scope.classForRevision = function(revision) {
      var vector = revision.operationVector();
      if(vector == 0) {
        return "default";
      } else if(vector == 1) {
        return "success";
      } else if(vector == -1) {
        return "danger";
      }
    }

    $scope.clearItemHistory = function() {
      if(!confirm("Are you sure you want to delete the local session history for this note?")) {
        return;
      }

      sessionHistory.clearItemHistory($scope.item).then(() => {
        $timeout(() => {
          $scope.reloadHistory();
        })
      });
    }

    $scope.clearAllHistory = function() {
      if(!confirm("Are you sure you want to delete the local session history for all notes?")) {
        return;
      }

      sessionHistory.clearAllHistory().then(() => {
        $timeout(() => {
          $scope.reloadHistory();
        })
      });
    }

    $scope.toggleDiskSaving = function() {
      sessionHistory.toggleDiskSaving().then(() => {
        $timeout(() => {
          $scope.diskEnabled = sessionHistory.diskEnabled;
        })
      });
    }

    $scope.toggleAutoOptimize = function() {
      sessionHistory.toggleAutoOptimize().then(() => {
        $timeout(() => {
          $scope.autoOptimize = sessionHistory.autoOptimize;
        })
      });
    }

  }

}

angular.module('app').directive('sessionHistoryMenu', () => new SessionHistoryMenu);
