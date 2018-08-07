import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import Status from '../components/Status.js';
import Gender from '../components/Gender.js';

import './Profile.css';

class Profile extends React.Component {
  constructor(props) {
    super(props);

    this.profileContainerRef = React.createRef();
    this.profileWarningRef = React.createRef();

    this.hasHighClearance = this.hasHighClearance.bind(this);
    this.isSysOpOrAdmin = this.isSysOpOrAdmin.bind(this);
    this.matchingCharacter = this.matchingCharacter.bind(this);
    this.displayProfile = this.displayProfile.bind(this);
  }

  displayProfile() {
    this.profileContainerRef.current.style.display = 'block';
    this.profileWarningRef.current.style.display = 'none';
  }

  hasHighClearance() {
    if (!this.props.user || !this.props.user.profile.selectedCharacter) {
      return false;
    }
    if (this.props.user.profile.selectedCharacter.sysOp || this.props.user.profile.selectedCharacter.admin || this.props.user.profile.selectedCharacter.globalModerator) {
      return true;
    }
    return false;
  }

  isSysOpOrAdmin() {
    if (!this.props.user || !this.props.user.profile.selectedCharacter) {
      return false;
    }
    if (this.props.user.profile.selectedCharacter.sysOp || this.props.user.profile.selectedCharacter.admin) {
      return true;
    }
    return false;
  }

  matchingCharacter() {
    if (!this.props.character) {
      return;
    }
    let nameRegEx = new RegExp("^" + this.props.characterName + "$", "i");
    let matchCharacter;
    this.props.character.profile.characters.forEach(character => {
      if (nameRegEx.test(character.nickname) === true) {
        matchCharacter = character;
      }
    });
    return matchCharacter;
  }

  render() {
    let character = this.matchingCharacter();
    return (
      <div className='profile'>
        {character && !character.sfw &&
          <>
            <div ref={this.profileWarningRef}>
              <div style={{marginBottom: '50px'}}></div>
              <div style={{marginBottom: '15px'}}><i className="fas fa-exclamation-triangle fa-4x" style={{color: 'red'}}></i></div>
              <div style={{marginBottom: '15px'}}>This profile is NSFW and may contain explicit sexual material, violence and foul language. You must be at least 18 years old to view this profile. Are you over 18 and willing
              to see adult content?</div>
              <button className="flatBlueButton" style={{border: '1px solid #3198db', background: '#111111', width: '100px'}} onClick={this.displayProfile}>CONTINUE</button>
            </div>
          </>
        }
        {this.props.character &&
          <>
            <div className='profileContainer' style={character.sfw ? {display: 'block'} : {display: 'none'} } ref={this.profileContainerRef}>
              <Status status={character.status} profile={true} />
              <span className='profileNickname'>{character.nickname}</span>
              <Gender character={character} />
              <div className='profilePersonalMessage'>{character.personalMessage}</div>
              {character.sysOp && <div className='profileUser'>{'> SysOp <'}</div>}
              {character.admin && <div className='profileUser'>{'> Admin <'}</div>}
              {character.globalModerator && <div className='profileUser'>{'> GlobalModerator <'}</div>}
              {!character.sysOp && !character.admin && !character.globalModerator && <div className='profileUser'>{'> User <'}</div>}
              {character.avatar !== '' &&
                <img src={character.avatar} />
              }
              <div style={{marginBottom: '30px'}}></div>
              {(this.hasHighClearance() || character.preferences.levelInProfile) &&
                <span style={{fontSize: '12px'}}>Level: {character.level}</span>
              }
              {(this.hasHighClearance() || character.preferences.pieCountInProfile) &&
                <span style={{fontSize: '12px', marginLeft: '30px'}}>Pie count: {character.pieCount}</span>
              }
              <div style={{marginBottom: '20px'}}></div>
              <dl>
                {(this.hasHighClearance() || character.preferences.accountNameInProfile) &&
                  <>
                    <dt>Account name: </dt>
                    <dd>{this.props.character.username}</dd>
                  </>
                }
                {(this.hasHighClearance() || character.preferences.emailInProfile) &&
                  <>
                    <dt>Email: </dt>
                    <dd>{this.props.character.emails[0].address}</dd>
                  </>
                }
                {(this.hasHighClearance() || character.preferences.lastLoginInProfile) &&
                  <>
                    <dt>Last login: </dt>
                    <dd>{character.lastLogin && character.lastLogin.toUTCString()}</dd>
                  </>
                }
                {this.isSysOpOrAdmin() &&
                  <>
                    <dt>IP Address: </dt>
                    <dd>{this.props.character.profile.ipAddress}</dd>
                  </>
                }
                {character.weburl !== '' &&
                  <>
                    <dt>Weburl: </dt>
                    <dd>{character.weburl}</dd>
                  </>
                }
                {character.socialMedia.skype !== '' &&
                  <>
                    <dt>Skype: </dt>
                    <dd>{character.socialMedia.skype}</dd>
                  </>
                }
                {character.socialMedia.discord !== '' &&
                  <>
                    <dt>Discord: </dt>
                    <dd>{character.socialMedia.discord}</dd>
                  </>
                }
                {character.socialMedia.facebook !== '' &&
                  <>
                    <dt>Facebook: </dt>
                    <dd>{character.socialMedia.facebook}</dd>
                  </>
                }
                {character.socialMedia.twitter !== '' &&
                  <>
                    <dt>Twitter: </dt>
                    <dd>{character.socialMedia.twitter}</dd>
                  </>
                }
              </dl>
              <div style={{marginBottom: '30px'}}></div>
              <div dangerouslySetInnerHTML={{__html: character.profile.html}} className='profileHtml'></div>
            </div>
          </>
        }
      </div>
    );
  }
}

export default withTracker(({ match }) => {
  let characterName = match.params.characterName;
  Meteor.subscribe('account.character', characterName);

  return {
    user: Meteor.user(),
    characterName: match.params.characterName,
    character: Meteor.users.findOne({ 'profile.characters.nickname': { $regex: new RegExp("^" + characterName + "$", "i") } }, { fields: { 'username': 1, 'emails': 1, 'profile.characters': 1, 'profile.ipAddress': 1 } })
  };
})(Profile);
