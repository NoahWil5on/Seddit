// make sure user is logged in
const requiresLogin = (req, res, next) => {
  if (!req.session.account) {
    return res.redirect('/');
  }
//   const locations = [
//     'home',
//     'comments',
//     'profile',
//   ];
// didn't have time to implement this but it wouldnt prevent users from having
// invalid data in their url params
//   if(req.query !== {}){
//     if(locations.includes(req.query.location)){
//         if(req.query.location === 'comments'){
//             if(req.query.post){
//                 return next();
//             }
//             return res.redirect('maker');
//         }
//         return next();
//     }
//     return res.redirect('maker');
//   }
  return next();
};
// make sure user is logged out
const requiresLogout = (req, res, next) => {
  if (req.session.account) {
    return res.redirect('maker');
  }
  return next();
};
// make sure user is on a secure page
const requiresSecure = (req, res, next) => {
  if (req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect(`https://${req.hostname}${req.url}`);
  }
  return next();
};
// screw security
const bypassSecure = (req, res, next) => {
  next();
};
// export modules
module.exports = {
  requiresLogin,
  requiresLogout,
};
// check if in production mode
if (process.env.NODE_ENV === 'production') {
  module.exports.requiresSecure = requiresSecure;
} else {
  module.exports.requiresSecure = bypassSecure;
}
