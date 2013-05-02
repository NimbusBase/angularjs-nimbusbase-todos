/*global todomvc */
'use strict';

/**
 * The main controller for the app. The controller:
 * - retrieves and persists the model via the todoStorage service
 * - exposes the model to the template and provides event handlers
 */
todomvc.controller('TodoCtrl', function TodoCtrl($scope, $location, nimbusbaseStorage, filterFilter) {
	var MODEL_NAME = 'todo';
	var store;
	var todos = $scope.todos = [];
	$scope.watcher = nimbusbaseStorage.makeWatcher(MODEL_NAME);

	Nimbus.Auth.authorized_callback = init;
	if(Nimbus.Auth.authorized()){
		init();
	}
	function init(){
		$('div.cover').fadeOut();
		store = nimbusbaseStorage.setup(MODEL_NAME, ['title', 'completed'], function(){
		var data = store.all();
		for (var i = 0; i < data.length; i++) {
			todos.push(data[i]);
		};
		$scope.$apply();
		});
	}

	$scope.newTodo = '';
	$scope.editedTodo = null;

	$scope.$watch('watcher()', function () {
		$scope.remainingCount = filterFilter(todos, {completed: false}).length;
		$scope.completedCount = todos.length - $scope.remainingCount;
		$scope.allChecked = !$scope.remainingCount;
	}, true);

	if ($location.path() === '') {
		$location.path('/');
	}

	$scope.location = $location;

	$scope.$watch('location.path()', function (path) {
		$scope.statusFilter = (path === '/active') ?
			{ completed: false } : (path === '/completed') ?
			{ completed: true } : null;
	});

	$scope.addTodo = function () {
		if(!$scope.newTodo.length || !store){
			return;
		}
		var todo = store.create({
			title: $scope.newTodo,
			completed: false
		});
		todos.push(todo);
		$scope.newTodo = '';
	};

	$scope.editTodo = function (todo) {
		$scope.editedTodo = todo;
	};

	$scope.doneEditing = function (todo) {
		$scope.editedTodo = null;
		todo.updateAttributes(todo.attributes());
		if (!todo.title) {
			$scope.removeTodo(todo);
		}
	};

	$scope.removeTodo = function (todo) {
		todo.destroy();
		var index = todos.indexOf(todo);
		if(index >= 0){
			todos.splice(index, 1);
		}
	};

	$scope.clearCompletedTodos = function () {
		$scope.todos = todos;
		for(var i = 0; i < todos.length; i++){
			var todo = todos[i];
			if(todo.completed){
				todo.destroy();
				todos.splice(i--, 1);
			}
		}
	};

	$scope.markAll = function (completed) {
		todos.forEach(function (todo) {
			todo.completed = completed;
			todo.updateAttributes(todo.attributes());
		});
	};

	$scope.toggleTodo = function(todo){
		todo.completed = !todo.completed;
		todo.updateAttributes(todo.attributes());
	}
});
