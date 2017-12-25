import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import Stylists from '../../../../api/stylists/stylists';
import StylistPortfolioPage from './StylistPortfolioPage';
import { withLoading } from '../../../components/HOC';

class StylistPortfolio extends Component {
  constructor(props) {
    super(props);

    this.state = {
      portfolioPhotos:
        props.stylist && props.stylist.portfolioPhotos
          ? _.cloneDeep(props.stylist.portfolioPhotos)
          : [],
      errors: {},
      saving: false,
      files: [],
    };

    this.handleFilesSelected = this.handleFilesSelected.bind(this);
  }

  componentDidMount() {
    this.props.showLoading();
  }

  componentWillReceiveProps(nextProps) {
    // after Profile object is fetched, set it in state
    if (nextProps.loading) {
      this.props.showLoading();
    } else {
      this.props.hideLoading();
    }

    this.setState({
      portfolioPhotos:
        nextProps.stylist && nextProps.stylist.portfolioPhotos
          ? _.cloneDeep(nextProps.stylist.portfolioPhotos)
          : [],
    });
  }

  handleFilesSelected(selectedFiles) {
    const newFiles = [];

    for (let index = 0; index < selectedFiles.length; index += 1) {
      const selectedFile = selectedFiles[index];

      // avoid select same file
      if (
        this.state.files.filter(currentFile =>
          currentFile.source.name === selectedFile.name &&
            currentFile.source.size === selectedFile.size &&
            currentFile.source.lastModified === selectedFile.lastModified).length === 0
      ) {
        newFiles.push({ source: selectedFile });
      }
    }

    this.setState({ files: [...this.state.files, ...newFiles] });

    newFiles.forEach((newFile) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        this.setState({
          files: this.state.files.map((file) => {
            if (
              file.source.name === newFile.source.name &&
              file.source.size === newFile.source.size &&
              file.source.lastModified === newFile.source.lastModified
            ) {
              return { source: file.source, image: reader.result };
            }
            return file;
          }),
        });
      };

      reader.readAsDataURL(newFile.source);
    });
  }

  render() {
    return (
      <StylistPortfolioPage
        portfolioPhotos={this.state.portfolioPhotos}
        saving={this.state.saving}
        onFilesSelected={this.handleFilesSelected}
        files={this.state.files}
      />
    );
  }
}

StylistPortfolio.defaultProps = {
  loading: false,
  stylist: null,
};

StylistPortfolio.propTypes = {
  loading: PropTypes.bool,
  stylist: PropTypes.object,
  showLoading: PropTypes.func.isRequired,
  hideLoading: PropTypes.func.isRequired,
};

export default withTracker(() => {
  const handleStylist = Meteor.subscribe('stylists.owner');

  return {
    loading: !handleStylist.ready(),
    stylist: Stylists.findOne(),
  };
})(withLoading(StylistPortfolio));
