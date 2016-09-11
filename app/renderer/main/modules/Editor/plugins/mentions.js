import isUuid from 'app/shared/helpers/isUuid.js';

(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.markdownitLinkAttributes = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict'

// Adapted from https://github.com/markdown-it/markdown-it/blob/fbc6b0fed563ba7c00557ab638fd19752f8e759d/docs/architecture.md

function markdownitLinkAttributes (md, config) {
  config = config || {}
  config.mentionClass = config.mentionClass || 'mention';

  var defaultRender = md.renderer.rules.link_open || this.defaultRender

  md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
    const token = tokens[idx];

    const currentHref = getAttribute(token, 'href')
    if(validateMention(currentHref)){
      const [ entityId, mentionType, mentionId ] = currentHref.split(':');
      writeAttribute(token, 'id',  mentionId );
      writeAttribute(token, 'class', config.mentionClass);
      if(mentionType == 'user'){
        writeAttribute(token, 'href', `users/${entityId}`);
      }
      else{
        writeAttribute(token, 'href', `tasks/${entityId}`);
      }
    }

    // pass token to default renderer.
    return defaultRender(tokens, idx, options, env, self)
  }
}


markdownitLinkAttributes.defaultRender = function (tokens, idx, options, env, self) {
  return self.renderToken(tokens, idx, options)
}

module.exports = markdownitLinkAttributes

},{}]},{},[1])(1)
});


function validateMention(href){
  // mention should be of the form 'entityId:entityType:mentionId'
  // Example: '47db55af7f342380174e228:user:cb4e8fac7fe980b53da95624'
  // Boths ids should be 24 characters.
  const hrefSplit = href.split(':');
  if(hrefSplit.length == 3){
    const [entityId, mentionType, mentionId] = hrefSplit;
    if(isUuid(entityId) && isUuid(mentionId)){
      return true
    }
    else{
      return false
    }
  }
  else{
    return false
  }
}

function getAttribute(token, attr){
  var aIndex = token.attrIndex(attr);
  return aIndex < 0 ? '' : token.attrs[aIndex][1];
}

function writeAttribute(token, attr, value){
  var aIndex = token.attrIndex(attr);
  if (aIndex < 0) { // attr doesn't exist, add new attribute
    token.attrPush([attr, value])
  } else { // attr already exists, overwrite it
    token.attrs[aIndex][1] = value
  }
}
