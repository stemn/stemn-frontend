import React, { Component } from 'react'
import StandardLayout from 'layout/StandardLayout'
import { Helmet } from 'react-helmet'
import classes from 'layout/layout.css'

export default class Security extends Component {
  render() {
    return (
      <StandardLayout contained style={ { marginTop: '30px' } } className={ classes.staticPage }>
        <Helmet>
          <title>Security</title>
        </Helmet>
        <h1>Security</h1>
        <p>We know your privacy is extremely important to you, and we're very protective of it.</p>
        <h2>Need to report a security vulnerability?</h2>
        <p>Email us at security@stemn.com and let us know.</p>
        <h2>Physical Security</h2>
        <ul>
          <li>Our servers are in an undisclosed location where no physical access is available.</li>
        </ul>
        <h2>System Security</h2>
        <ul>
          <li>System installation using hardened, patched OS.</li>
          <li>Distributed Denial of Service (DDoS) mitigation services powered by industry-leading solutions.</li>
        </ul>
        <h2>Operational Security</h2>
        <ul>
          <li>Systems access logged and tracked for auditing purposes.</li>
        </ul>
        <h2>Communications</h2>
        <p>All data, public or private, exchanged with STEMN is always transmitted over SSL (which is why you see HTTPS and the padlock in your browser’s address bar).</p>
        <h2>File system and backups</h2>
        <p>Every piece of hardware we use has an identical copy ready and waiting for an immediate hot-swap in case of hardware or software failure. Every piece of data related to STEMN is saved on a minimum of three different servers, including an off-site backup. We do not retroactively remove data from backups when deleted by the user, as we may need to restore the data if it was removed accidentally.</p>
        <p>We do not encrypt our data on disk because it would not be any more secure: the website and supporting data would need to be decrypted on demand, slowing down response times. Any user with shell access to the file system would have access to the decryption routine, thus negating any security it provides. Therefore, we focus on making our machines and network as secure as possible.</p>
        <h2>Maintaining security</h2>
        <p>All passwords are filtered from all our logs and are one-way encrypted in the database using <span>bcrypt</span>. Login information is always sent over SSL.</p>
        <h2>Contact Us</h2>
        <p>Have a question, concern, or comment about STEMN security? Please contact <a href="mailto:security@stemn.com">security@stemn.com</a>.</p>
        <br />
        <br />
        <small>Last Updated: 14 March 2015</small>
      </StandardLayout>
    )
  }
}
