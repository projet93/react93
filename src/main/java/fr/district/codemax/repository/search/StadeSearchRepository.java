package fr.district.codemax.repository.search;

import fr.district.codemax.domain.Stade;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the {@link Stade} entity.
 */
public interface StadeSearchRepository extends ElasticsearchRepository<Stade, Long> {
}
