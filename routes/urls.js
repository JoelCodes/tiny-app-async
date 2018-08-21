const Router = require('express').Router;

function makeUrlsRouter(dataHelper){
  
  const {getUrl,getUrlsByUserId,createUrl,deleteUrl,updateUrl} = dataHelper;

  const urlsRouter = new Router();

  // If someone who is not signed in tries to use this, boot them to login
  urlsRouter.use('/urls', (req, res, next) => {
    if(!req.user){
      res.redirect('/login');
    } else {
      next();
    }
  });

  urlsRouter.get('/urls', (req, res) => {
    getUrlsByUserId(req.user.id, (err, urls) => {
      res.render('urls_index', {urls});
    });
  });

  urlsRouter.post('/urls', (req, res) => {
    createUrl(req.body.longURL, req.user.id, (err, url) => {
      res.redirect(`/urls/${url.shortUrl}`);
    });
  });

  urlsRouter.get('/urls/new', (req, res)=> {
    res.render('urls_new');
  });

  urlsRouter.use('/urls/:id', (req, res, next) => {
    getUrl(req.params.id, (err, url) => {
      console.log(url);
      if(!url){
        res.sendStatus(404);
      } else if(url.userId !== req.user.id) {
        res.sendStatus(403);
      } else {
        res.locals.url = url;
        next();
      }
    })
  });

  urlsRouter.get('/urls/:id', (req, res) => {
    console.log(req.url);
    res.render('urls_show');
  });

  urlsRouter.post('/urls/:id', (req, res) => {
    updateUrl(req.params.id, req.body.newLongURL, (err) => {
      res.redirect('/urls/' + req.params.id);
    });
  });

  urlsRouter.post('/urls/:id/delete', (req, res) => {
    deleteUrl(req.params.id, (err) => {
      res.redirect('/urls');
    });
  });

  urlsRouter.get('/u/:shortUrl', (req, res) => {
    getUrl(req.params.shortUrl, (err, url) => {
      if(url){
        res.redirect(url.longUrl);
      } else {
        res.sendStatus(404);
      }
    })
  });

  return {urlsRouter};
}

module.exports = makeUrlsRouter;