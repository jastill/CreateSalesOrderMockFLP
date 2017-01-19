sap.ui.define(["sap/ui/core/mvc/Controller"], function(BaseController) {
	"use strict";

	return BaseController.extend("generated.app.controller.D0_1461229087346", {

		onInit: function() {
			this._oDialog = this.getView().getContent()[0];
		},
		onExit: function() {
			this._oDialog.destroy();
		},
		setRouter: function(oRouter) {
			this.oRouter = oRouter;
		},
		_onButtonPress2: function() {
			this.getView().getContent()[0].close();
		}
	});
}, /* bExport= */ true);