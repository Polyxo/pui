import React from 'react';
import Link from 'next/link';
import styles from './card.module.scss';
import slugifyWithSlashes from '../../../lib/slugifyWithSlashes';

const CardWrapper = ({ article, detail = 'posts' }: any) => {
  //const src = article?.coverImage;
  //const srcElement = require(pathInclude);
  /*const srcElement = dynamic(() => import(article.coverImagePath), {
    suspense: true,
  });
  
   {/*<Image src={srcElement} sizes={'(max-width: 710px) 40vw, 300px'} />*/

  return (
    <Link
      href={`/${detail}/${slugifyWithSlashes(article.slug)}`}
      className={styles.card}
      legacyBehavior>
      <div>
        {/*multimedia ? (
          multimedia
        ) : (
          <MultimediaElement src={src} className={styles.multimedia} />
        )*/}
        {/*srcElement && (
          <div className={styles.multimedia}>
           
          </div>
        )*/}

        <span className={styles.body}>
          <p className={styles.title}>{article.title}</p>
          {(article.excerpt || article.subtitle) && (
            <p className={styles.subTitle}>
              {article.excerpt ? article.excerpt : article.subtitle}
            </p>
          )}
          {/*<Link href={`/${detail}/${article.slug}`}>
            <a className={styles.moreLink}>
              Continue reading <FontAwesomeIcon icon={faArrowRight} />
            </a>
          </Link>*/}
        </span>
      </div>
    </Link>
  );
};

export default CardWrapper;
