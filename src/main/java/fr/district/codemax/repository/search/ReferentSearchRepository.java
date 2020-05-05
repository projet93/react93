package fr.district.codemax.repository.search;

import fr.district.codemax.domain.Referent;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the {@link Referent} entity.
 */
public interface ReferentSearchRepository extends ElasticsearchRepository<Referent, Long> {
}
