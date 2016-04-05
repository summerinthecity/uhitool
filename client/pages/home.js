var $ = require('jquery');
var PageView = require('./base');
var templates = require('../templates');
var Me = require('./../models/me');
var d3 = require('d3');
var crossfilter = require('crossfilter');
var app = require('ampersand-app');

module.exports = PageView.extend({
    pageTitle: 'home',
    template: templates.pages.home,
    events: {
        'click [data-hook~=download]': 'downloadSession',
        'change [data-hook~=session-upload-input]': 'uploadSession',
    },
    downloadSession: function () {
        var fileLoader = this.queryByHook('session-upload-input');

        var json = JSON.stringify(app.me.toJSON());
        var blob = new Blob([json], {type: "application/json"});
        var url = window.URL.createObjectURL(blob);

        var a = this.queryByHook('download');
        a.download = "session.json";
        a.href        = url;

        // FIXME: should clean up url:
        // window.URL.revokeObjectURL(url);
    },
    uploadSession: function () {
        var fileLoader = this.queryByHook('session-upload-input');
        var uploadedFile = fileLoader.files[0];

        var reader = new FileReader();

        // NOTE: for the release, remove the option of custom data sets,
        // this simplifies adding/removing data from crossfilter and dcjs
        reader.onload = function (evt) {
            var data = JSON.parse(evt.target.result);
            app.me.set(data);
            app.navigate('/analyze');
        };

        reader.onerror = function (evt) {
            console.log("Error loading session", evt);
        };

        reader.readAsText(uploadedFile);
    },
});
