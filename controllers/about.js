"use strict";

import logger from "../utils/logger.js";
import playlistStore from "../models/playlist-store.js";
import accounts from './accounts.js';

const about = {
  createView(request, response) {
    
    
    // app statistics calculations
    const playlists = playlistStore.getAllPlaylists();

    // song and playlist totals
    let numPlaylists = playlists.length;
    let numSongs = 0;
    for (let item of playlists) {
      numSongs += item.songs.length;
    }

    // average
    let average = 0;
    if (numPlaylists > 0) {
      average = (numSongs / numPlaylists).toFixed(2);
    }

    // largest
    let currentLargest = 0;
    let largestPlaylistTitle = "";
    for (let playlist of playlists) {
      if (playlist.songs.length > currentLargest) {
        currentLargest = playlist.songs.length;
      }
    }

    for (let playlist of playlists) {
      if (playlist.songs.length === currentLargest) {
        largestPlaylistTitle += playlist.title + ", ";
      }
    }

    // smallest
    let currentSmallest = playlists[0].songs.length;
    let smallestPlaylistTitle = "";
    for (let playlist of playlists) {
      if (playlist.songs.length < currentSmallest) {
        currentSmallest = playlist.songs.length;
      }
    }

    for (let playlist of playlists) {
      if (playlist.songs.length === currentSmallest) {
        smallestPlaylistTitle += playlist.title + ", ";
      }
    }

    const loggedInUser = accounts.getCurrentUser(request);
    logger.info("About page loading!");
    
    if (loggedInUser) {
    const viewData = {
      title: "Playlist App About",
      fullname: loggedInUser.firstName + ' ' + loggedInUser.lastName,
      displayNumPlaylists: numPlaylists,
      displayNumSongs: numSongs,
      average: average,
      largest: largestPlaylistTitle.substring(0, largestPlaylistTitle.length-2),
      smallest: smallestPlaylistTitle.substring(0, smallestPlaylistTitle.length-2),
  
    };
    
    response.render("about", viewData);
    }
    else
      response.redirect('/');
  },
};

export default about;
