import React, { Component } from 'react'
import StandardLayout from 'layout/StandardLayout'

import classes from 'layout/layout.css'
import Link from 'stemn-shared/misc/Router/Link'
import { Helmet } from 'react-helmet'

export default class Terms extends Component {
  render() {
    return (
      <StandardLayout contained style={ { marginTop: '30px' } } className={ classes.staticPage }>
        <Helmet>
          <title>Terms</title>
        </Helmet>
        <h1>Terms</h1>
        <p>
          <strong>
          By using the stemn.com web site ("Service"), or any services of STEMN PTY. LTD. ("STEMN"), you are agreeing to be bound by the following terms and conditions ("Terms of Service").
          </strong>
        </p>
        <br />
        <p>
          IF YOU ARE ENTERING INTO THIS AGREEMENT ON BEHALF OF A COMPANY OR OTHER LEGAL ENTITY, YOU REPRESENT THAT YOU HAVE THE AUTHORITY TO BIND SUCH ENTITY, ITS AFFILIATES AND ALL USERS WHO ACCESS OUR SERVICES THROUGH YOUR ACCOUNT TO THESE TERMS AND CONDITIONS, IN WHICH CASE THE TERMS "YOU" OR "YOUR" SHALL REFER TO SUCH ENTITY, ITS AFFILIATES AND USERS ASSOCIATED WITH IT. IF YOU DO NOT HAVE SUCH AUTHORITY, OR IF YOU DO NOT AGREE WITH THESE TERMS AND CONDITIONS, YOU MUST NOT ACCEPT THIS AGREEMENT AND MAY NOT USE THE SERVICES.
        </p>
        <p>
          If STEMN makes material changes to these Terms, we will notify you by email or by posting a notice on our site before the changes are effective. Any new features that augment or enhance the current Service, including the release of new tools and resources, shall be subject to the Terms of Service. Continued use of the Service after any such changes shall constitute your consent to such changes. You can review the most current version of the Terms of Service at any time at: <Link name="termsRoute">https://stemn.com/terms</Link>
        </p>
        <p>
          Violation of any of the terms below will result in the termination of your Account. While STEMN prohibits such conduct and Content on the Service, you understand and agree that STEMN cannot be responsible for the Content posted on the Service and you nonetheless may be exposed to such materials. You agree to use the Service at your own risk.
        </p>
        <h2>A. Account Terms</h2>
        <ol>
          <li>You must be 13 years or older to use this Service.</li>
          <li>You must be a human. Accounts registered by "bots" or other automated methods are not permitted.</li>
          <li>You must provide your name, a valid email address, and any other information requested in order to complete the signup process.</li>
          <li>You are responsible for maintaining the security of your account and password. STEMN cannot and will not be liable for any loss or damage from your failure to comply with this security obligation.</li>
          <li>You are responsible for all Content posted and activity that occurs under your account.</li>
          <li>You may not use the Service for any illegal or unauthorised purpose. You must not, in the use of the Service, violate any laws in your jurisdiction (including but not limited to copyright or trademark laws).</li>
        </ol>
        <h2>B. Cancellation and Termination</h2>
        <ol>
          <li>You are solely responsible for properly cancelling your account. An email or phone request to cancel your account is not considered cancellation. You can cancel your account at any time from the user settings page.</li>
          <li>All of your Content will be immediately deleted from the Service upon cancellation. This information can not be recovered once your account is cancelled.</li>
          <li>STEMN, in its sole discretion, has the right to suspend or terminate your account and refuse any and all current or future use of the Service, or any other STEMN service, for any reason at any time. Such termination of the Service will result in the deactivation or deletion of your Account or your access to your Account, and the forfeiture and relinquishment of all Content in your Account. STEMN reserves the right to refuse service to anyone for any reason at any time.</li>
          <li>In the event that STEMN takes action to suspend or terminate an account, we will make a reasonable effort to provide the affected account owner with a copy of their account contents upon request, unless the account was suspended or terminated due to unlawful conduct.</li>
        </ol>
        <h2>C. Modifications to the Service</h2>
        <ol>
          <li>STEMN reserves the right at any time and from time to time to modify or discontinue, temporarily or permanently, the Service (or any part thereof) with or without notice.</li>
          <li>STEMN shall not be liable to you or to any third-party for any modification, suspension or discontinuance of the Service.</li>
        </ol>
        <h2>D. Copyright and Content Ownership</h2>
        <ol>
          <li>We claim no intellectual property rights over the material you provide to the Service. Your profile and materials uploaded remain yours. However, this information will be made publically accessible which may, in some jurisdictions, affect your intellectual property rights.</li>
          <li>It is your responsibility to properly license your content where applicable. STEMN can not be held liabile for incorrect implementation or ineffective content licenses.</li>
          <li>STEMN does not pre-screen Content, but STEMN and its designee have the right (but not the obligation) in their sole discretion to refuse or remove any Content that is available via the Service.</li>
          <li>You shall defend STEMN against any claim, demand, suit or proceeding made or brought against STEMN by a third-party alleging that Your Content, or Your use of the Service in violation of this Agreement, infringes or misappropriates the intellectual property rights of a third-party or violates applicable law, and shall indemnify STEMN for any damages finally awarded against, and for reasonable attorney’s fees incurred by, STEMN in connection with any such claim, demand, suit or proceeding; provided, that STEMN (a) promptly gives You written notice of the claim, demand, suit or proceeding; (b) gives You sole control of the defense and settlement of the claim, demand, suit or proceeding (provided that You may not settle any claim, demand, suit or proceeding unless the settlement unconditionally releases STEMN of all liability); and (c) provides to You all reasonable assistance, at Your expense.</li>
          <li>The look and feel of the Service is copyright ©2015 STEMN PTY. LTD. All rights reserved. You may not duplicate, copy, or reuse any portion of the HTML/CSS, Javascript, or visual design elements or concepts without express written permission from STEMN.</li>
        </ol>
        <h2>E. General Conditions</h2>
        <ol>
          <li>Your use of the Service is at your sole risk. The service is provided on an "as is" and "as available" basis.</li>
          <li>Support for STEMN services is only available in English, via email.</li>
          <li>You understand that STEMN uses third-party vendors and hosting partners to provide the necessary hardware, software, networking, storage, and related technology required to run the Service.</li>
          <li>You must not modify, adapt or hack the Service or modify another website so as to falsely imply that it is associated with the Service, STEMN, or any other STEMN service.</li>
          <li>You give permissions for STEMN administrators to edit your content.</li>
          <li>You may use the STEMN Pages static hosting service solely as permitted and intended to host your organisation pages, personal pages, or project pages, and for no other purpose. You may not use STEMN Pages in violation of STEMN's trademark or other rights or in violation of applicable law. STEMN reserves the right at all times to reclaim any STEMN subdomain without liability to you.</li>
          <li>You agree not to reproduce, duplicate, copy, sell, resell or exploit any portion of the Service, use of the Service, or access to the Service without the express written permission by STEMN.</li>
          <li>We may, but have no obligation to, remove Content and Accounts containing Content that we determine in our sole discretion are unlawful, offensive, threatening, libelous, defamatory, pornographic, obscene or otherwise objectionable or violates any party's intellectual property or these Terms of Service.</li>
          <li>Verbal, physical, written or other abuse (including threats of abuse or retribution) of any STEMN customer, employee, member, or officer will result in immediate account termination.</li>
          <li>You understand that the technical processing and transmission of the Service, including your Content, may be transferred unencrypted and involve (a) transmissions over various networks; and (b) changes to conform and adapt to technical requirements of connecting networks or devices.</li>
          <li>You must not upload, post, host, or transmit unsolicited email, SMSs, or "spam" messages.</li>
          <li>You must not transmit any worms or viruses or any code of a destructive nature.</li>
          <li>If your bandwidth usage significantly exceeds the average bandwidth usage (as determined solely by STEMN) of other STEMN customers, we reserve the right to immediately disable your account or throttle your file hosting until you can reduce your bandwidth consumption.</li>
          <li>STEMN does not warrant that (i) the service will meet your specific requirements, (ii) the service will be uninterrupted, timely, secure, or error-free, (iii) the results that may be obtained from the use of the service will be accurate or reliable, (iv) the quality of any products, services, information, or other material purchased or obtained by you through the service will meet your expectations, and (v) any errors in the Service will be corrected.</li>
          <li>You expressly understand and agree that STEMN shall not be liable for any direct, indirect, incidental, special, consequential or exemplary damages, including but not limited to, damages for loss of profits, goodwill, use, data or other intangible losses (even if STEMN has been advised of the possibility of such damages), resulting from: (i) the use or the inability to use the service; (ii) the cost of procurement of substitute goods and services resulting from any goods, data, information or services purchased or obtained or messages received or transactions entered into through or from the service; (iii) unauthorised access to or alteration of your transmissions or data; (iv) statements or conduct of any third-party on the service; (v) or any other matter relating to the service.</li>
          <li>The failure of STEMN to exercise or enforce any right or provision of the Terms of Service shall not constitute a waiver of such right or provision. The Terms of Service constitutes the entire agreement between you and STEMN and govern your use of the Service, superseding any prior agreements between you and STEMN (including, but not limited to, any prior versions of the Terms of Service). You agree that these Terms of Service and Your use of the Service are governed under California law.</li>
          <li>Questions about the Terms of Service should be sent to <a href="mailto:sue@stemn.com">sue@stemn.com</a>.</li>
        </ol>
        <br />
        <br />
        <small>Last Updated: 20 April 2015</small>
      </StandardLayout>
    )
  }
}
