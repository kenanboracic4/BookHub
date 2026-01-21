// middleware/timingHelper.js
const withTiming = (name, mw) => async (req, res, next) => {
    const t0 = process.hrtime.bigint();
    
    const done = (err) => {
        const ms = Number(process.hrtime.bigint() - t0) / 1e6;
        console.log(`MW ${name}: ${ms.toFixed(1)}ms`);
        return next(err);
    };

    try {
        await mw(req, res, done);
    } catch (e) {
        return done(e);
    }
};

module.exports = withTiming;