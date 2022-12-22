import recordsRouter from './recording';
import analyticsRouter from './analytics';
import config from '../config';


exports.default = function (app) {
    app.use(config.api.baseAPI + '/analytics', analyticsRouter);
    app.use(config.api.baseAPI + '/', recordsRouter);
}