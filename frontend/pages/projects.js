import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import fetch from 'isomorphic-unfetch'
import Error from 'next/error'
import Masonry from 'react-masonry-component'
import Layout from '../components/Layout'
import ScreenWrapper from '../components/ScreenWrapper'
import PageWrapper from '../components/PageWrapper'
import config from '../config'

class Projects extends Component {
  static propTypes = {
    page: PropTypes.object.isRequired,
    projects: PropTypes.array.isRequired,
  }

  static async getInitialProps(ctx) {
    const { slug, apiRoute } = ctx.query
    console.log(slug, apiRoute)
    const { apiUrl } = config
    const pageRes = await fetch(`${apiUrl}/projects`)
    const page = await pageRes.json()

    const projectsRes = await fetch(`${apiUrl}/wp-json/wp/v2/projects?_embed`)
    const projects = await projectsRes.json()
    console.log(projects)
    return { page, projects }
  }

  render() {
    const { page, projects } = this.props
    const projectImages = projects.map(project => ({
      image:
        project._embedded[`wp:featuredmedia`][0].media_details.sizes
          .medium_large.source_url,
      slug: project.slug,
      link: project.link,
    }))

    if (!page.title) return <Error statusCode={404} />

    return (
      <ScreenWrapper screen="all-projects">
        {() => (
          <Fragment>
            <Layout>
              <section className="projects-page">
                <h1 className="lead">MY WORK</h1>
                <Masonry>
                  {projectImages.map(({ image, slug, link }) => (
                    <Link href={`project/${slug}`} as={`project/${slug}`}>
                      <a className="masonry__project-anchor">
                        <img
                          className="masonry__project-image"
                          src={image}
                          alt={slug}
                        />
                      </a>
                    </Link>
                  ))}
                </Masonry>
              </section>
            </Layout>
          </Fragment>
        )}
      </ScreenWrapper>
    )
  }
}

export default PageWrapper(Projects)
