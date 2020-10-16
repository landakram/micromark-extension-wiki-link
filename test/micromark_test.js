import assert from "assert";

import micromark from "micromark";

import { syntax, html } from '..';

describe('micromark-extension-wiki-link', () => {
  it("parses a wiki link that has a matching permalink", () => {
    let serialized = micromark('[[Wiki Link]]', {
      extensions: [syntax()],
      htmlExtensions: [html({ permalinks: ['wiki_link'] })]
    });

    assert.equal(serialized, '<p><a href="#/page/wiki_link" class="internal">Wiki Link</a></p>');
  });

  it("parses a wiki link that has no matching permalink", () => {
    let serialized = micromark('[[Wiki Link]]', {
      extensions: [syntax()],
      htmlExtensions: [html()]
    });

    assert.equal(serialized, '<p><a href="#/page/wiki_link" class="internal new">Wiki Link</a></p>');
  });


  it("handles wiki links with aliases", () => {
    let serialized = micromark('[[Real Page:Page Alias]]', {
      extensions: [syntax()],
      htmlExtensions: [html()]
    });

    assert.equal(serialized, '<p><a href="#/page/real_page" class="internal new">Page Alias</a></p>');
  });

  it("handles wiki links with a custom alias divider", () => {
    let serialized = micromark('[[Real Page|Page Alias]]', {
      extensions: [syntax({ aliasDivider: "|" })],
      htmlExtensions: [html()]
    });

    assert.equal(serialized, '<p><a href="#/page/real_page" class="internal new">Page Alias</a></p>');
  });

  context("configuration options", () => {
    it("uses pageResolver", () => {
      let identity = (name) => [name];

      let serialized = micromark('[[A Page]]', {
        extensions: [syntax()],
        htmlExtensions: [html({
          pageResolver: identity,
          permalinks: ["A Page"]
        })]
      });

      assert.equal(serialized, '<p><a href="#/page/A Page" class="internal">A Page</a></p>');
    });

    it("uses newClassName", () => {
      let serialized = micromark('[[A Page]]', {
        extensions: [syntax()],
        htmlExtensions: [html({
          newClassName: "new_page"
        })]
      });

      assert.equal(serialized, '<p><a href="#/page/a_page" class="internal new_page">A Page</a></p>');
    });

    it("uses hrefTemplate", () => {
      let hrefTemplate = (permalink) => permalink;
      let serialized = micromark('[[A Page]]', {
        extensions: [syntax()],
        htmlExtensions: [html({
          hrefTemplate: hrefTemplate
        })]
      });

      assert.equal(serialized, '<p><a href="a_page" class="internal new">A Page</a></p>');
    });

    it("uses wikiLinkClassName", () => {
      let serialized = micromark('[[A Page]]', {
        extensions: [syntax()],
        htmlExtensions: [html({
          wikiLinkClassName: 'wiki_link',
          permalinks: ['a_page']
        })]
      });

      assert.equal(serialized, '<p><a href="#/page/a_page" class="wiki_link">A Page</a></p>');
    });
  });
})
