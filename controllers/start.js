'use strict';

import logger from "../utils/logger.js";
import appStore from "../models/app-store.js";
import accounts from "./accounts.js";
import playlistStore from "../models/playlist-store.js";

const start = {
  
  createView(request, response) { 
    const loggedInUser = accounts.getCurrentUser(request);
    logger.info("Start page loading!");
    const playlists = playlistStore.getUserPlaylists(loggedInUser.id);
    logger.info(playlists);
    // song and playlist totals for user
    let numUserPlaylists = playlists.length;
    let numUserSongs = 0;
    for (let item of playlists) {
      numUserSongs += item.songs.length;
    }
    
    if (loggedInUser) {
    const viewData = {
      title: "Welcome to the Playlist app!",
      displayNumUserPlaylists: numUserPlaylists,
      displayNumUserSongs: numUserSongs,
      info: appStore.getAppInfo(),
      fullname: loggedInUser.firstName + ' ' + loggedInUser.lastName,
    };
    
    //logger.debug(viewData);
    response.render('start', viewData);   
    }
    else response.redirect('/');
    },
};

export default start;