const requiresLogin = (req, res, next) => {
  if (!req.session.account) {
    return res.redirect('/');
  }
  var locations = [
      'home',
      'comments',
      'profile'
  ]
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
const requiresLogout = (req, res, next) => {
  if (req.session.account) {
    return res.redirect('maker');
  }
  return next();
};

const requiresSecure = (req, res, next) => {
  if (req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect(`https://${req.hostname}${req.url}`);
  }
  return next();
};
const bypassSecure = (req, res, next) => {
  next();
};

module.exports = {
  requiresLogin,
  requiresLogout,
};
if (process.env.NODE_ENV === 'production') {
  module.exports.requiresSecure = requiresSecure;
} else {
  module.exports.requiresSecure = bypassSecure;
}
