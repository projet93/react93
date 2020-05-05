package fr.district.codemax.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import fr.district.codemax.web.rest.TestUtil;

public class ReferentTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Referent.class);
        Referent referent1 = new Referent();
        referent1.setId(1L);
        Referent referent2 = new Referent();
        referent2.setId(referent1.getId());
        assertThat(referent1).isEqualTo(referent2);
        referent2.setId(2L);
        assertThat(referent1).isNotEqualTo(referent2);
        referent1.setId(null);
        assertThat(referent1).isNotEqualTo(referent2);
    }
}
