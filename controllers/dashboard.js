'use strict';

import logger from "../utils/logger.js";
import playlistStore from "../models/playlist-store.js";
import { v4 as uuidv4 } from 'uuid';
import accounts from './accounts.js';

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
      logger.info('user' + loggedInUser.id);
    response.render('dashboard', viewData);
    }
    else response.redirect('/');
  },
  addPlaylist(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);
    logger.debug(loggedInUser.id);
    const timestamp = new Date();
    const newPlaylist = {
      userid: loggedInUser.id,
      id: uuidv4(),
      title: request.body.title,
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
  
    updatePlaylist(request, response) {
    const playlistId = request.params.id;
    logger.debug("updating playlist " + playlistId);
    let data=playlistStore.getPlaylist(playlistId);
    let storedsongs= data.songs;
    let storeddate = data.date;  
    logger.info(request.body.title)
    const updatedPlaylist = {
      id: playlistId,
      title: request.body.title,
      songs:storedsongs,
      date:storeddate
    };
    playlistStore.editPlaylist(playlistId,  updatedPlaylist);
    response.redirect("/dashboard");
  }
};

export default dashboard;