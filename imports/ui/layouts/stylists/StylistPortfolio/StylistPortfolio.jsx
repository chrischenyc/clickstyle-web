import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import Stylists from '../../../../api/stylists/stylists';
import StylistPortfolioPage from './StylistPortfolioPage';
import { withLoading } from '../../../components/HOC';

const compareFiles = (file1, file2) =>
  file1.name === file2.name &&
  file1.size === file2.size &&
  file1.lastModified === file2.lastModified;

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
    this.handleFileDeleted = this.handleFileDeleted.bind(this);
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
        this.state.files.filter(currentFile => compareFiles(currentFile.source, selectedFile))
          .length === 0
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
            if (compareFiles(file.source, newFile.source)) {
              return { source: file.source, image: reader.result };
            }
            return file;
          }),
        });
      };

      reader.readAsDataURL(newFile.source);
    });
  }

  handleFileDeleted(deletedFile) {
    this.setState({
      files: this.state.files.filter(file => !compareFiles(file.source, deletedFile.source)),
    });
  }

  render() {
    return (
      <StylistPortfolioPage
        portfolioPhotos={this.state.portfolioPhotos}
        saving={this.state.saving}
        onFilesSelected={this.handleFilesSelected}
        onFileDeleted={this.handleFileDeleted}
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
