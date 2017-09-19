function Test($el) { 
    this.$el = $($el);
    if (this.$el.length===0){ 
        this.$el = $('body');
    }
}
Test.prototype = {
    init: function (vjson) {
        this.$el.html(vjson.text);
     }
}