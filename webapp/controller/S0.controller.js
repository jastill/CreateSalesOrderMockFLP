sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History"
], function(BaseController, History) {
	"use strict";

	return BaseController.extend("generated.app.controller.S0", {

		onAfterRendering: function() {

		},

		onInit: function() {
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.getTarget("S0").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));

			// We only want this behavior in master -> detail and not in master -> master where it causes unwanted issues
			var view = this.getView();
			view.addEventDelegate({
				onBeforeShow: function() {
					var content = this.getView().getContent();
					if (content) {
						if (!sap.ui.Device.system.phone) {
							var oList = content[0].getContent() ? content[0].getContent()[0] : undefined;
							if (oList) {
								var contentName = oList.getMetadata().getName();
								if (contentName.indexOf('List') > -1) {
									oList.attachEventOnce("updateFinished", function() {
										var oFirstListItem = this.getItems()[0];
										if (oFirstListItem) {
											oList.setSelectedItem(oFirstListItem);
											oList.fireItemPress({
												listItem: oFirstListItem
											});
										}
									}.bind(oList));
								}
							}
						}
					}
				}.bind(this)
			});

		},
		handleRouteMatched: function(oEvent) {
			var params = {};
			if (oEvent.mParameters.data.context || oEvent.mParameters.data.masterContext) {
				this.sContext = oEvent.mParameters.data.context;
				this.sMasterContext = oEvent.mParameters.data.masterContext;

				if (!this.sMasterContext) {
					this.getView().bindElement("/" + this.sContext, params);
				} else {
					this.getView().bindElement("/" + this.sMasterContext, params);
				}

			}

		},
		_onButtonPress8: function(oEvent) {
			var dialogName = "D1_1464080436618";
			this.dialogs = this.dialogs || {};
			var dialog = this.dialogs[dialogName];
			var source = oEvent.getSource();
			var bindingContext = source.getBindingContext();
			var path = (bindingContext) ? bindingContext.getPath() : null;
			var model = (bindingContext) ? bindingContext.getModel() : this.getView().getModel();
			var view;
			if (!dialog) {
				view = sap.ui.xmlview({
					viewName: "generated.app.view." + dialogName
				});
				view._sOwnerId = this.getView()._sOwnerId;
				//need to set router so we can use navigation in dialogs
				view.getController().setRouter(this.oRouter);
				dialog = view.getContent()[0];
				this.dialogs[dialogName] = dialog;
			}
			dialog.open();
			if (view) {
				dialog.attachAfterOpen(function() {
					dialog.rerender();
				});
			} else {
				view = dialog.getParent();
			}
			view.setModel(model);
			if (path) {
				view.bindElement(path, {});
			}
		},
		_onListItemPress: function(oEvent) {
			var oListItem = oEvent.getParameter("listItem");
			var oBindingContext = oListItem.getBindingContext();

			this.doNavigate("S1", oBindingContext);

		},
		doNavigate: function(sRouteName, oBindingContext) {

			var that = this;
			var sPath = (oBindingContext) ? oBindingContext.getPath() : null;
			var oModel = (oBindingContext) ? oBindingContext.getModel() : null;

			var entityNameSet;
			if (sPath !== null && sPath !== "") {

				if (sPath.substring(0, 1) === "/") {
					sPath = sPath.substring(1);
				}
				entityNameSet = sPath.split("(")[0];
			}
			var navigationPropertyName;
			var sMasterContext = this.sMasterContext ? this.sMasterContext : sPath;

			if (entityNameSet !== null) {
				navigationPropertyName = that.getOwnerComponent().getNavigationPropertyForNavigationWithContext(entityNameSet, sRouteName);
			}
			if (navigationPropertyName !== null && navigationPropertyName !== undefined) {
				if (navigationPropertyName === "") {
					this.oRouter.navTo(sRouteName, {
						context: sPath,
						masterContext: sMasterContext
					}, false);
				} else {
					oModel.createBindingContext(navigationPropertyName, oBindingContext, null, function(bindingContext) {
						sPath = bindingContext.getPath();
						if (sPath.substring(0, 1) === "/") {
							sPath = sPath.substring(1);
						}

						// If the navigation is a 1-n, sPath would be "undefined" as this is not supported in Build
						if (sPath === "undefined") {
							that.oRouter.navTo(sRouteName);
						} else {
							that.oRouter.navTo(sRouteName, {
								context: sPath,
								masterContext: sMasterContext
							}, false);
						}
					});
				}
			} else {
				this.oRouter.navTo(sRouteName);
			}
		}
	});
}, /* bExport= */ true);