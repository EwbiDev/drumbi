import PropTypes from "prop-types";

const beatProp = PropTypes.shape({
  beatNum: PropTypes.number.isRequired,
  hit: PropTypes.bool.isRequired,
});

export { beatProp };
