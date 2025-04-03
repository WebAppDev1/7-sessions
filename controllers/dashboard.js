'use strict';

import logger from "../utils/logger.js";
import playlistStore from '../models/playlist-store.js';
import accounts from './accounts.js';
import { v4 as uuidv4 } from 'uuid';

const dashboard = {
  createView(request, response) {
    logger.info('dashboard rendering');
    const loggedInUser = accounts.getCurrentUser(request);
    if (loggedInUser) {
    const viewData = {
      title: 'Playlist Dashboard',
      playlists: playlistStore.getUserPlaylists(loggedInUser.id),
      fullname: loggedInUser.firstName + ' ' + loggedInUser.lastName,
    };
    logger.info('about to render' + viewData.playlists);
    response.render('dashboard', viewData);
    }
    else response.redirect('/');
  },
  
  addPlaylist(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);
    const timestamp = new Date();
	
    const newPlaylist = {
      userid: loggedInUser.id,
      id: uuidv4(),
      title: request.body.title,
      category: request.body.category,
      rating: request.body.rating,
      songs: [],
      date: timestamp
    };

    playlistStore.addPlaylist(newPlaylist);
    response.redirect('/dashboard');
  },

  deletePlaylist(request, response) {
    const playlistId = request.params.id;
    logger.debug(`Deleting Playlist ${playlistId}`);
    playlistStore.removePlaylist(playlistId);
    response.redirect("/dashboard");
  },

};

export default dashboard;
