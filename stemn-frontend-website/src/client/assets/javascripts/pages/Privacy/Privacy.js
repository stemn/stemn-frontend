import React, { Component } from 'react'
import StandardLayout from 'layout/StandardLayout'
import { Helmet } from 'react-helmet'
import classes from 'layout/layout.css'
import Link from 'stemn-shared/misc/Router/Link'

export default class Privacy extends Component {
  render() {
    return (
      <StandardLayout contained style={ { marginTop: '30px' } } className={ classes.staticPage }>
        <Helmet>
          <title>Privacy</title>
        </Helmet>
        <h1>Privacy</h1>
        <h2>General Information</h2>
        <p>We collect the e-mail addresses of those who communicate with us via e-mail, aggregate information on what pages consumers access or visit, and information volunteered by the consumer (such as survey information and/or site registrations). The information we collect is used to improve the content of our Web pages and the quality of our service, and is not shared with or sold to other organisations for commercial purposes, except to provide products or services you've requested, when we have your permission, or under the following circumstances:</p>
        <ul>
          <li>It is necessary to share information in order to investigate, prevent, or take action regarding illegal activities, suspected fraud, situations involving potential threats to the physical safety of any person, violations of <Link to="/terms">Terms of Service</Link>, or as otherwise required by law.</li>
          <li>We transfer information about you if STEMN is acquired by or merged with another company. In this event, STEMN will notify you before information about you is transferred and becomes subject to a different privacy policy.</li>
        </ul>
        <h2>Information Gathering and Usage</h2>
        <ul>
          <li>When you register for STEMN we ask for information such as your name and email address. If you sign up through Facebook, Google, or LinkedIn you may be asked for additional information.</li>
          <li>While browsing the site, we collect information for analytics purposes. This information describes how you use our site, some of which is personally identifiable.</li>
          <li>STEMN uses collected information for the following general purposes: products and services provision, identification and authentication, services improvement, contact, and research.</li>
        </ul>
        <h2>Data Storage</h2>
        <p>STEMN uses third-party vendors and hosting partners to provide the necessary hardware, software, networking, storage, and related technology required to run STEMN. Although STEMN owns the code, databases, and all rights to the STEMN application, you retain all rights to your data.</p>
        <h2>Disclosure</h2>
        <p>STEMN may disclose personally identifiable information under special circumstances, such as to comply with subpoenas or when your actions violate the <Link to="/terms">Terms of Service</Link>.</p>
        <h2>Changes</h2>
        <p>STEMN may periodically update this policy. We will notify you about significant changes in the way we treat personal information by sending a notice to the primary email address specified in your STEMN primary account holder account or by placing a prominent notice on our site.</p>
        <h2>Questions</h2>
        <p>Any questions about this Privacy Policy should be addressed to <a href="mailto:sue@stemn.com">sue@stemn.com</a>.</p>
        <br />
        <br />
        <small>Last Updated: 11 March 2015</small>
      </StandardLayout>
    )
  }
}
