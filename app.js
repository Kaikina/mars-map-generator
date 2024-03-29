const fs = require('fs');
const jsyaml = require('js-yaml');
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');
const createSwaggerUiMiddleware = require('@coorpacademy/swagger-ui-express');

const mapsRouter = require('./src/api/v1/maps');

const createServer = () => {
	const app = express();

// view engine setup
	app.set('views', path.join(__dirname, 'views'));
	app.set('view engine', 'ejs');

	app.use(logger('dev'));
	app.use(express.json());
	app.use(express.urlencoded({ extended: false }));
	app.use(cookieParser());
	app.use(express.static(path.join(__dirname, 'src/public')));
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: false }));

	app.use('/api/v1/maps', mapsRouter);

	const spec = fs.readFileSync(path.resolve(__dirname, 'swagger.yaml'), 'utf8');
	const swaggerDoc = jsyaml.safeLoad(spec);

	app.use(
		createSwaggerUiMiddleware({
			swaggerDoc,
			swaggerUi: '/explorer'
		})
	);

// catch 404 and forward to error handler
	app.use(function(req, res, next) {
		next(createError(404));
	});

// error handler
	app.use(function(err, req, res, next) {
		// set locals, only providing error in development
		if (process.env.NODE_ENV !== 'test') console.log(err);
		res.locals.message = err.message;
		res.locals.error = req.app.get('env') === 'development' ? err : {};
		res.status(err.status || 500);

		if (req.accepts('application/json')) {
			return res.send(err);
		}
		// render the error page
		res.render('error');
	});
	return app;
};

module.exports = createServer;
