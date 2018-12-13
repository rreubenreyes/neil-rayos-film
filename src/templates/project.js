import React, { Component, Fragment, createRef } from 'react'
import PropTypes from 'prop-types'

import ScreenWrapper from '../components/ScreenWrapper'
import WindowContext from '../context/windowContext'

export default class Project extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    pathContext: PropTypes.object.isRequired,
  }

  state = {
    activeSlide: `synopsis`,
  }

  projectDescription = createRef()

  projectNav = createRef()

  navMarker = createRef()

  componentDidMount = () => {
    window.addEventListener(`resize`, this.setMarkerPosition)
    this.setMarkerPosition()
  }

  componentWillUnmount = () => {
    window.removeEventListener(`resize`, this.setMarkerPosition)
  }

  setMarkerPosition = () => {
    if (!this.projectNav.current) return
    const activeItem = document.querySelector(`li.active`)
    const ul = this.projectNav.current
    const navMarker = this.navMarker.current
    const { left: ulLeft } = ul.getBoundingClientRect()
    const { left, width } = activeItem.getBoundingClientRect()
    const markerWidthOffset = 5

    navMarker.style.left = `${left - ulLeft + width / 2 - markerWidthOffset}px`
  }

  handleMenuClick = (e) => {
    const ul = this.projectNav.current
    if (e.target === ul) return
    const { slide: activeSlide } = e.target.dataset
    const listItems = Array.from([...ul.children][0]).filter(
      listItem => listItem.localName === `li`,
    )
    listItems.forEach(({ classList }) => {
      /* eslint-disable-next-line */
      classList.contains(`active`) && classList.remove(`active`)
    })

    e.target.classList.add(`active`)
    this.setMarkerPosition()
    this.setState({
      activeSlide,
    })
  }

  render() {
    const {
      data: {
        contentfulProject: {
          title, synopsis, production, directorsThoughts,
        },
      },
      pathContext: { slug },
    } = this.props
    const { activeSlide } = this.state
    // const videoId = video_url.split(`=`)[1]
    const videoId = `0`
    // const description = { __html: acf[activeSlide] }
    const description = `placeholder`

    return (
      <WindowContext.Consumer>
        {({ isWindowLandscape }) => (
          <Fragment>
            <ScreenWrapper screen="single-project">
              {() => (
                <Fragment>
                  {console.log(`project`, isWindowLandscape) && true}
                  <h1
                    className={`lead${
                      isWindowLandscape ? `--center` : ``
                    } project__header`}
                  >
                    {title}
                  </h1>
                  <div className="project__iframe-wrapper">
                    <iframe
                      className="project__video-embed"
                      title={title}
                      width="960px"
                      height="auto"
                      src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                      frameBorder="0"
                      allowFullScreen
                    />
                  </div>
                  {isWindowLandscape && (
                    <div className="project__video-padding" />
                  )}
                  <div className="project__body">
                    {isWindowLandscape && (
                      <ul
                        className="project__nav"
                        ref={this.projectNav}
                        onClick={this.handleMenuClick}
                      >
                        <div
                          className="project__nav--marker"
                          ref={this.navMarker}
                        />
                        <li className="active" data-slide="synopsis">
                          Synopsis
                        </li>
                        <li data-slide="production">Production</li>
                        <li data-slide="directors_thoughts">
                          {`Director's`}
                          {` `}
                          Thoughts
                        </li>
                      </ul>
                    )}
                    <div>
                      {isWindowLandscape ? (
                        <div
                          className="project__description"
                          dangerouslySetInnerHTML={{ __html: `description` }}
                        />
                      ) : (
                        <Fragment>
                          <div
                            className="project__description"
                            dangerouslySetInnerHTML={{ __html: `description` }}
                          />
                          <div
                            className="project__description"
                            dangerouslySetInnerHTML={{ __html: `production` }}
                          />
                          <div
                            className="project__description"
                            dangerouslySetInnerHTML={{
                              __html: `director's thoughts`,
                            }}
                          />
                        </Fragment>
                      )}
                    </div>
                  </div>
                </Fragment>
              )}
            </ScreenWrapper>
          </Fragment>
        )}
      </WindowContext.Consumer>
    )
  }
}

/* eslint-disable no-undef */
export const pageQuery = graphql`
  query SingleProjectQuery($slug: String!) {
    contentfulProject(slug: { eq: $slug }) {
      title
      releaseDate(formatString: "MMMM Do, YYYY")
      synopsis {
        content {
          nodeType
          content {
            nodeType
            value
          }
        }
      }
      production {
        content {
          nodeType
          content {
            nodeType
            value
          }
        }
      }
      directorsThoughts {
        content {
          nodeType
          content {
            nodeType
            value
          }
        }
      }
      category {
        title
      }
    }
  }
`