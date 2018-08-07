import React from 'react';
import { Meteor } from 'meteor/meteor';

import './Gender.css';

export default class Gender extends React.Component {
  constructor(props) {
    super(props);

  }

  render() {
    return (
      <div className='genderContainer'>
        {this.props.character.gender === 'Neutral' &&
          <>
            <img className='genderIcon' src="../icons/neutralicon.png" width='12' height='12' />
            <span className='gender'><i>Neutral</i></span>
          </>
        }
        {this.props.character.gender === 'Male' &&
          <>
            <img className='genderIcon' src="./icons/maleicon.png" width='12' height='12' />
            <span className='gender'><i>Male</i></span>
          </>
        }
        {this.props.character.gender === 'Female' &&
          <>
            <img className='genderIcon' src="./icons/femaleicon.png" width='12' height='12' />
            <span className='gender'><i>Female</i></span>
          </>
        }
      </div>
    );
  }
}
