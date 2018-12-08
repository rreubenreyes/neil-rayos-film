import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Header from './Header'
// import Footer from './Footer'

const ScreenWrapper = ({
  screen, children, main, spanInline,
}) => (
  <Fragment>
    <Header />
    <section
      id={screen}
      className={`screen__fullscreen${main ? `--main` : ``} ${spanInline
        && `span-inline`}`}
    >
      {children()}
    </section>
  </Fragment>
)

ScreenWrapper.propTypes = {
  children: PropTypes.func.isRequired,
  screen: PropTypes.string.isRequired,
  spanInline: PropTypes.bool,
  main: PropTypes.bool,
}

ScreenWrapper.defaultProps = {
  main: false,
  spanInline: false,
}

export default ScreenWrapper