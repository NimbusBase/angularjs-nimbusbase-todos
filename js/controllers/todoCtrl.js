/*global todomvc */
'use strict';

/**
 * The main controller for the app. The controller:
 * - retrieves and persists the model via the todoStorage service
 * - exposes the model to the template and provides event handlers
 */
todomvc.controller('TodoCtrl', function TodoCtrl($scope, $location, nimbusStorage, filterFilter) {
	var store;
	var todos = $scope.todos = [];

	Nimbus.Auth.authorized_callback = init;
	if(Nimbus.Auth.authorized()){
		init();
	}
	function init(){
		$('div.cover').fadeOut();
		store = nimbusStorage('todo', ['title', 'completed'], function(){
			fetchAll();
		});
	}
	function fetchAll(){
		todos = $scope.todos = store.all();
		$scope.$apply();
	}

	$scope.newTodo = '';
	$scope.editedTodo = null;

	$scope.$watch('todos', function () {
		$scope.remainingCount = filterFilter(todos, {completed: false}).length;
		$scope.completedCount = todos.length - $scope.remainingCount;
		$scope.allChecked = !$scope.remainingCount;
		console.log('todos changed');
		console.log(JSON.stringify(todos));
	}, false);

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
		fetchAll();
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
		fetchAll();
	};

	$scope.clearCompletedTodos = function () {
		$scope.todos = todos = todos.forEach(function (todo) {
			if(todo.completed){
				todo.destroy();
			}
		});
		fetchAll();
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
