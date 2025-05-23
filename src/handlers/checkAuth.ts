import {Request, Response, NextFunction} from 'express';

function checkAuth(req: Request, res: Response, next: NextFunction) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash('error', 'You must be logged in to view this page');
        res.redirect('/auth/login');
    }
}

function checkNotAuth(req: Request, res: Response, next: NextFunction) {
    if (!req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/dash');
    }
}

export { checkAuth, checkNotAuth };