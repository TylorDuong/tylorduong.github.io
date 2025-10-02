---
layout: default
title: Portfolio
permalink: /portfolio/
---

# Portfolio

Browse a selection of my projects with videos and pictures. Click a card to open the main media.

<div class="gallery">
{% for p in site.data.projects %}
  {% assign firstMedia = p.media | first %}
  {% if firstMedia and firstMedia.src %}
    {% assign hrefUrl = firstMedia.src %}
  {% else %}
    {% assign hrefUrl = p.cover %}
  {% endif %}
  <div class="card">
    <a href="{{ hrefUrl | relative_url }}" target="_blank" rel="noopener">
      <div class="card-media">
        <img src="{{ p.cover | relative_url }}" alt="{{ p.title }} cover">
      </div>
    </a>
    <div class="card-body">
      <h3>{{ p.title }}</h3>
      <p>{{ p.description }}</p>
      {% if p.tags %}
      <div class="badges">
        {% for t in p.tags %}
          <span class="badge">{{ t }}</span>
        {% endfor %}
      </div>
      {% endif %}
    </div>
  </div>
{% endfor %}
</div>

<p class="muted">Tip: Put images in <code>assets/images/</code> and videos in <code>assets/videos/</code>. Update <code>_data/projects.yml</code> to add or edit projects.</p>
