var TIMEOUT_DURATION_FOR_APPEND_FIX = 0; //250

define(function(require, exports, module) {
	main.consumes = ["Wizard", "WizardPage", "ui", "commands", "menus", "Form", 'Datagrid'];
	main.provides = ["bug.wizard"];
	return main;

	function main(options, imports, register) {
		var Wizard = imports.Wizard;
		var WizardPage = imports.WizardPage;
		var ui = imports.ui;
		var menus = imports.menus;
		var commands = imports.commands;
		var Form = imports.Form;
		var Datagrid = imports.Datagrid;

		var STEP1_FORM_DIV_WRAPPER_ID = getFormWrapperId('1');
		var STEP2_FORM_DIV_WRAPPER_ID = getFormWrapperId('2');
		var datagrid, datagridChecked = [];
		/***** Initialization *****/

		var plugin = new Wizard("Smartface.io", main.consumes, {
			title: "Wizard",
			allowClose: true,
			height: 400
		});

		plugin.on("draw", function() {
			var step1 = createStep1(plugin);
			var step2 = createStep2(plugin);

			plugin.on("next", function(e) {
				var page = e.activePage;
				if (page.name === "step1") {
					return step2;
				} else if (page.name === 'step2') {
					var chosen_items = step2.collectSelected();
					return step2;
				}
				return step1;
			}, plugin);

			plugin.startPage = step1;
		});

		plugin.on("load", function() {
			load();
		});

		plugin.on("unload", function() {});

		plugin.freezePublicAPI({});

		register(null, {
			"bug.wizard": plugin
		});

		/***** Functions *****/

		function getFormWrapperId(num) {
			return 'bug-wizard-step' + num + '-form-wrapper';
		}

		function createStep1(plugin) {
			var step = new WizardPage({
				name: "step1",
				elements: [{
					type: "button",
					id: "next",
					caption: "Next",
					"default": true,
					onclick: next
				}]
			}, plugin);

			step.on("draw", function(e) {
				ui.insertHtml(e.html, require("text!./step1.html"), step);
				afterHtmlStep1(TIMEOUT_DURATION_FOR_APPEND_FIX);
			});

			return step;

			function afterHtmlStep1(wait) {
				if (wait) {
					return setTimeout(afterHtmlStep1, wait);
				}
				var div = document.getElementById(STEP1_FORM_DIV_WRAPPER_ID);
				console.log('result of document.getgetElementById("' + STEP1_FORM_DIV_WRAPPER_ID + '"', div);
				var select_elem_len = 5;
				var items = [];
				for (var i = 0; i < select_elem_len; i++) {
					items.push({
						caption: "Item " + i,
						value: "Item " + i
					});
				}
				var form = new Form({
					html: div,
					edge: "10 10 10 10",
					colwidth: 100,
					form: [{
						title: "License Type",
						type: "dropdown",
						name: "bug-select",
						"empty-message": "Fetching...",
						items: items
					}]
				});
			}
		}

		function createStep2(plugin) {
			var step = new WizardPage({
				name: "step2",
				elements: [{
					type: "button",
					id: "next",
					caption: "Generate",
					//color: "aqua",
					"default": true,
					onclick: next
				}]
			}, plugin);

			step.on("draw", function(e) {
				ui.insertHtml(e.html, require("text!./step2.html"), step);
				afterHtmlStep2(TIMEOUT_DURATION_FOR_APPEND_FIX);
			});

			return step;

			function afterHtmlStep2(wait) {
				if (wait) {
					return setTimeout(afterHtmlStep2, wait);
				}
				var div = document.getElementById(STEP2_FORM_DIV_WRAPPER_ID);
				console.log('result of document.getgetElementById("' + STEP2_FORM_DIV_WRAPPER_ID + '"', div);
				datagrid = new Datagrid({
					container: div,
					enableCheckboxes: true,
					columns: [{
						caption: "Name",
						value: "label",
						width: "35%",
						type: "tree"
					}, {
						caption: "Description",
						value: "description",
						width: "65%"
					}]
				}, step);
				setDataGridItems(datagrid);

				function setDataGridItems(datagrid) {
					var root_len = 2;
					var child_len = 3;
					var main_items = [];

					for (var i = 0; i < root_len; i++) {
						var main_item_child_items = [];
						for (var j = 0; j < child_len; j++) {
							main_item_child_items.push({
								isOpen: true,
								label: "root#" + i + " - child#" + j,
								description: "Description of " + i + "-" + j
							});
						}
						main_items.push({
							label: "root Item " + i,
							description: "Description of " + i,
							items: main_item_child_items
						});
					}
					datagrid.setRoot({
						items: main_items
					});
					datagrid.resize();
				}
			}
		}

		function next() {
			console.log(plugin);
		}

		function addCommand() {
			commands.addCommand({
				name: "bug.wizard",
				isAvailable: function() {
					return true;
				},
				exec: function() {
					plugin.show();
				}
			}, plugin);
			menus.addItemByPath("Tools/Buggy Wizard", new ui.item({
				command: "bug.wizard"
			}), 300, plugin);
		}

		function load() {
			addCommand();
		}
	}
});