import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Search, Button } from 'semantic-ui-react';
import _ from 'lodash';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import { formatDate, parseDate } from 'react-day-picker/moment';
import 'react-day-picker/lib/style.css';
import './react-day-picker-custom.css';

import TimeInput from '../TimeInput';
import {
  urlQueryDateString,
  parseUrlQueryDate,
  dateString,
  datePickerFormat,
} from '../../../modules/format-date';

import { ServiceNameToSEOName, SuburbNameToSEOName } from '../../../modules/seo-name';
import parseSearchUrlParams from '../../../modules/client/parse-search-url';
import { DEFAULT_DURATION } from '../../../modules/constants';

const suburbString = (suburbObject) => {
  if (!_.isNil(suburbObject) && !_.isNil(suburbObject.name)) {
    let returnString = suburbObject.name;

    if (!_.isNil(suburbObject.postcode)) {
      returnString += ` ${suburbObject.postcode}`;
    }

    return returnString;
  }

  return '';
};

const suburbObject = (suburb, postcode) => (suburb && { name: suburb, postcode }) || null;

class SearchBar extends Component {
  constructor(props) {
    super(props);

    const {
      service, suburb, postcode, date, time, duration,
    } = parseSearchUrlParams(props);

    this.state = {
      service: service || '', // value of service input
      suburb: suburb || '', // value of suburb input
      selectedSuburb: suburbObject(suburb, postcode),
      date: date || '',
      time: time || '',
      duration: duration || DEFAULT_DURATION, // in minutes
      services: [], // services/addons keywords search data source
      matchedServices: [],
      searchingSuburb: false,
      matchedSuburbs: [],
    };

    this.handleServiceChange = this.handleServiceChange.bind(this);
    this.handleServiceSelection = this.handleServiceSelection.bind(this);

    this.handleSuburbChange = this.handleSuburbChange.bind(this);
    this.handleSuburbSelection = this.handleSuburbSelection.bind(this);
  }

  componentDidMount() {
    Meteor.call('services.keywords', (error, services) => {
      if (services) {
        this.setState({
          services,
        });
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    const {
      service, suburb, postcode, date, time, duration,
    } = parseSearchUrlParams(nextProps);

    this.setState({
      service: service || '', // value of service input
      suburb: suburb || '', // value of suburb input
      selectedSuburb: suburbObject(suburb, postcode),
      date: date || '',
      time: time || '',
      duration: duration || DEFAULT_DURATION,
    });
  }

  handleServiceChange(data) {
    let matchedServices = this.state.services.filter(service => service.title.toLowerCase().indexOf(data.value.toLowerCase()) !== -1);
    if (_.isEmpty(data.value)) {
      matchedServices = this.state.services;
    }

    this.setState({
      service: data.value,
      matchedServices,
    });
  }

  handleServiceSelection(service) {
    this.setState({ service: service.title, duration: service.duration });
  }

  handleSuburbChange(data) {
    // once user starts changing the search keyword
    // we empty current selected suburb object
    this.setState({ suburb: data.value, selectedSuburb: null });

    if (_.isEmpty(data.value)) {
      this.setState({ searchingSuburb: false, matchedSuburbs: [] });
    } else {
      this.setState({ searchingSuburb: true });
      Meteor.call('suburbs.search.published', data.value, (error, suburbs) => {
        this.setState({ searchingSuburb: false });
        if (!error) {
          this.setState({
            matchedSuburbs: suburbs.map(suburb => ({
              ...suburb,
              title: `${suburb.name} ${suburb.postcode}`,
            })),
          });
        }
      });
    }
  }

  handleSuburbSelection(selectedSuburb) {
    this.setState({
      selectedSuburb,
      suburb: suburbString(selectedSuburb),
    });
  }

  handleSearch() {
    const {
      service, selectedSuburb, date, time, duration,
    } = this.state;

    if (!_.isEmpty(service)) {
      this.redirectToSearch({
        service,
        suburb: selectedSuburb && selectedSuburb.name,
        postcode: selectedSuburb && selectedSuburb.postcode,
        date,
        time,
        duration,
      });
    } 
  }

  /**
   * Input can be passed from children component, i.e.: SearchBar.jsx
   * or from route url params, i.e.: /:service/:suburb?/:postcode?
   *
   * Depends on the available params, page wil be redirected to various search route
   *
   * @param {name of the service or addon, required} service
   * @param {name of the suburb, optional} suburb
   * @param {postcode, optional} postcode
   */
  redirectToSearch({
    service, suburb, postcode, date, time, duration,
  }) {
    let searchUrl = '/stylists';

    if (!_.isNil(service) && service.length > 0) {
      searchUrl += `/${ServiceNameToSEOName(service)}`;
    }

    if (!_.isNil(suburb) && suburb.length > 0) {
      searchUrl += `/${SuburbNameToSEOName(suburb)}`;
    }

    if (!_.isNil(postcode) && postcode.length > 0) {
      searchUrl += `/${postcode}`;
    }

    if (parseUrlQueryDate(date).isValid()) {
      searchUrl += `?date=${date}`;

      if (!_.isNil(time) && time.length > 0) {
        const timeQueryString = time;
        searchUrl += `&time=${timeQueryString}`;
      }

      if (!_.isNil(duration)) {
        searchUrl += `&duration=${duration}`;
      }
    }

    this.props.history.push(encodeURI(searchUrl));
  }

  render() {
    const {
      service, matchedServices, suburb, searchingSuburb, matchedSuburbs,
    } = this.state;

    return (
      <div className="main-search-input">
        <div className="main-search-input-item service">
          <Search
            input={
              <input
                type="text"
                onFocus={(e) => {
                  this.handleServiceChange(e.target);
                }}
                onKeyPress={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    this.handleSearch();
                  }
                }}
              />
            }
            name="service"
            placeholder="Service e.g Makeup, stylist name"
            value={service}
            minCharacters={0}
            onResultSelect={(e, { result }) => {
              this.handleServiceSelection(result);
            }}
            onSearchChange={(e, data) => {
              this.handleServiceChange(data);
            }}
            results={matchedServices}
            showNoResults={false}
          />
        </div>

        <div className="main-search-input-item suburb">
          <Search
            input={
              <input
                type="text"
                onKeyPress={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    this.handleSearch();
                  }
                }}
              />
            }
            name="suburb"
            placeholder="Suburb, postcode"
            value={suburb}
            minCharacters={2}
            loading={searchingSuburb}
            onResultSelect={(e, { result }) => {
              this.handleSuburbSelection(result);
            }}
            onSearchChange={(e, data) => {
              this.handleSuburbChange(data);
            }}
            results={matchedSuburbs}
            showNoResults={false}
          />
        </div>

        <div className="main-search-input-item date">
          <DayPickerInput
            clickUnselectsDay
            inputProps={{
              readOnly: 'true',
            }}
            value={
              parseUrlQueryDate(this.state.date).isValid()
                ? dateString(parseUrlQueryDate(this.state.date))
                : ''
            }
            placeholder="Any date, any time"
            onDayChange={(date) => {
              this.setState({ date: _.isNil(date) ? '' : urlQueryDateString(date) });
            }}
            format={datePickerFormat}
            formatDate={formatDate}
            parseDate={parseDate}
            dayPickerProps={{
              modifiers: {
                disabled: { before: new Date() },
                selected: day => urlQueryDateString(day) === this.state.date,
              },
            }}
          />
        </div>

        <div className="main-search-input-item time">
          <TimeInput
            placeholder="Any time"
            optional
            value={this.state.time}
            onChange={(time) => {
              this.setState({ time });
            }}
          />
        </div>

        <Button
          color="teal"
          circular
          onClick={() => {
            this.handleSearch();
          }}
        >
          Search
        </Button>
      </div>
    );
  }
}

export default withRouter(SearchBar);
