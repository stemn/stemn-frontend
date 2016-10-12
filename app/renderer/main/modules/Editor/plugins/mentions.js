import { validateMention } from 'app/renderer/main/modules/Mentions/Mentions.utils.js';

(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.markdownitLinkAttributes = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict'

// Adapted from https://github.com/markdown-it/markdown-it/blob/fbc6b0fed563ba7c00557ab638fd19752f8e759d/docs/architecture.md

function markdownitLinkAttributes (md, config) {
  config = config || {}
  config.mentionClass = config.mentionClass || 'mention';

  var textRenderer = md.renderer.rules.text || this.defaultRender;
  md.renderer.rules.text = function (tokens, idx, options, env, self) {

    const token1 = tokens[idx];
    const token2 = tokens[idx+1];
    const token3 = tokens[idx+2];
    const href   = token2 ? getAttribute(token2, 'href') : '';

    const isValidMention = token1.content.endsWith('@') && validateMention(href) && token3;

    // If we have the '@' trigger at the end of the string
    if(isValidMention){
      // Remove the trigger
      token1.content = token1.content.slice(0, -1);
      // Create the mention link
      const [ entityId, mentionType, mentionId ] = href.split(':');
      writeAttribute(token2, 'id',  mentionId );
      writeAttribute(token2, 'class', config.mentionClass);
      const link    = mentionType == 'user' ? writeAttribute(token2, 'href', `users/${entityId}`) : writeAttribute(token2, 'href', `tasks/${entityId}`);
      const trigger = mentionType == 'user' ? '@' : '#';
      // Add the trigger to the inside of the anchor
      token3.content = trigger.concat(token3.content);
    }
    return textRenderer(tokens, idx, options, env, self)
  }
}


markdownitLinkAttributes.defaultRender = function (tokens, idx, options, env, self) {
  return self.renderToken(tokens, idx, options)
}

module.exports = markdownitLinkAttributes

},{}]},{},[1])(1)
});


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
