import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";

import React from "react";
import PropTypes from "prop-types";
import { Segment } from "semantic-ui-react";

import JobsList from "./JobsList";
import Loading from "../../components/Loading";

import Jobs from "../../../api/Jobs";

const JobsPage = ({ loading, jobs }) => (
  <div className="below-fixed-menu">
    {loading ? (
      <Loading />
    ) : (
      <Segment vertical>
        <JobsList jobs={jobs} />
      </Segment>
    )}
  </div>
);

JobsPage.propTypes = {
  loading: PropTypes.bool.isRequired,
  jobs: PropTypes.array.isRequired
};

export default withTracker(() => {
  const handle = Meteor.subscribe("jobs");

  return {
    loading: !handle.ready(),
    jobs: Jobs.find({}).fetch()
  };
})(JobsPage);
