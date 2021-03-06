var app = require('ampersand-app');
var ContentView = require('./widget-content');
var templates = require('../templates');
var dc = require('dc');

module.exports = ContentView.extend({
    template: templates.includes.piechart,

    renderContent: function() {
        var x = parseInt(0.8 * this.el.offsetWidth);
        var y = parseInt(x);

        // dont do anything without a facet defined
        if(! this.model.primary) {
            return;
        }
        if(! this.model._crossfilter) {
            this.model.initFilter();
        }

        // tear down existing stuff
        delete this._chart;

        var chart = dc.pieChart(this.queryByHook('piechart'));
        var that = this; // used in callback
        chart
            .transitionDuration(app.me.anim_speed)
            .dimension(this.model._crossfilter.dimension)
            .slicesCap(36)
            .group(this.model._crossfilter.group)
            .valueAccessor(this.model._crossfilter.valueAccessor)
            .on('filtered', function(chart) {
                if (chart.hasFilter()) {
                    that.model.selection = chart.filters();
                }
            });

        if(this.model.selection) {
            chart.filter([this.model.selection]);
        }

        chart.render();
        this._chart = chart;
    },
});
