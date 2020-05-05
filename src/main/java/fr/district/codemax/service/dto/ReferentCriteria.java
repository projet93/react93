package fr.district.codemax.service.dto;

import java.io.Serializable;
import java.util.Objects;
import io.github.jhipster.service.Criteria;
import io.github.jhipster.service.filter.BooleanFilter;
import io.github.jhipster.service.filter.DoubleFilter;
import io.github.jhipster.service.filter.Filter;
import io.github.jhipster.service.filter.FloatFilter;
import io.github.jhipster.service.filter.IntegerFilter;
import io.github.jhipster.service.filter.LongFilter;
import io.github.jhipster.service.filter.StringFilter;

/**
 * Criteria class for the {@link fr.district.codemax.domain.Referent} entity. This class is used
 * in {@link fr.district.codemax.web.rest.ReferentResource} to receive all the possible filtering options from
 * the Http GET request parameters.
 * For example the following could be a valid request:
 * {@code /referents?id.greaterThan=5&attr1.contains=something&attr2.specified=false}
 * As Spring is unable to properly convert the types, unless specific {@link Filter} class are used, we need to use
 * fix type specific filters.
 */
public class ReferentCriteria implements Serializable, Criteria {

    private static final long serialVersionUID = 1L;

    private LongFilter id;

    private StringFilter nom;

    private StringFilter prenom;

    private StringFilter licence;

    private StringFilter telephone;

    private StringFilter email;

    private LongFilter userId;

    public ReferentCriteria(){
    }

    public ReferentCriteria(ReferentCriteria other){
        this.id = other.id == null ? null : other.id.copy();
        this.nom = other.nom == null ? null : other.nom.copy();
        this.prenom = other.prenom == null ? null : other.prenom.copy();
        this.licence = other.licence == null ? null : other.licence.copy();
        this.telephone = other.telephone == null ? null : other.telephone.copy();
        this.email = other.email == null ? null : other.email.copy();
        this.userId = other.userId == null ? null : other.userId.copy();
    }

    @Override
    public ReferentCriteria copy() {
        return new ReferentCriteria(this);
    }

    public LongFilter getId() {
        return id;
    }

    public void setId(LongFilter id) {
        this.id = id;
    }

    public StringFilter getNom() {
        return nom;
    }

    public void setNom(StringFilter nom) {
        this.nom = nom;
    }

    public StringFilter getPrenom() {
        return prenom;
    }

    public void setPrenom(StringFilter prenom) {
        this.prenom = prenom;
    }

    public StringFilter getLicence() {
        return licence;
    }

    public void setLicence(StringFilter licence) {
        this.licence = licence;
    }

    public StringFilter getTelephone() {
        return telephone;
    }

    public void setTelephone(StringFilter telephone) {
        this.telephone = telephone;
    }

    public StringFilter getEmail() {
        return email;
    }

    public void setEmail(StringFilter email) {
        this.email = email;
    }

    public LongFilter getUserId() {
        return userId;
    }

    public void setUserId(LongFilter userId) {
        this.userId = userId;
    }


    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        final ReferentCriteria that = (ReferentCriteria) o;
        return
            Objects.equals(id, that.id) &&
            Objects.equals(nom, that.nom) &&
            Objects.equals(prenom, that.prenom) &&
            Objects.equals(licence, that.licence) &&
            Objects.equals(telephone, that.telephone) &&
            Objects.equals(email, that.email) &&
            Objects.equals(userId, that.userId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(
        id,
        nom,
        prenom,
        licence,
        telephone,
        email,
        userId
        );
    }

    @Override
    public String toString() {
        return "ReferentCriteria{" +
                (id != null ? "id=" + id + ", " : "") +
                (nom != null ? "nom=" + nom + ", " : "") +
                (prenom != null ? "prenom=" + prenom + ", " : "") +
                (licence != null ? "licence=" + licence + ", " : "") +
                (telephone != null ? "telephone=" + telephone + ", " : "") +
                (email != null ? "email=" + email + ", " : "") +
                (userId != null ? "userId=" + userId + ", " : "") +
            "}";
    }

}
