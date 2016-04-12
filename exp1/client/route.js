Router.route('/', function() {
  this.render('lobby');
});

Router.route('/experiment', function() {
  this.render('experiment');
});

Router.route('/survey', function() {
  this.render('survey');
});