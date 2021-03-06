/*
Copyright 2018 FileThis, Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/app-storage/app-localstorage/app-localstorage-document.js';

import 'ft-accordion-item/ft-accordion-item.js';
import 'ft-labeled-icon-button/ft-labeled-icon-button.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-pages/iron-pages.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/paper-tabs/paper-tabs.js';
import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-listbox/paper-listbox.js';
import './style-panel.js';
import './inspect-panel.js';
import 'ft-connect-wizard/demo/ft-connect-wizard-settings-editor.js';
import 'ft-connection-panel/demo/ft-connection-panel-settings-editor.js';
import 'ft-connection-panel/ft-connection-panel-settings-behavior.js';
import 'ft-connection-list-item/demo/ft-connection-list-item-settings-editor.js';
import 'ft-connection-list-item/ft-connection-list-item-settings-behavior.js';
import 'ft-document-panel/demo/ft-document-panel-settings-editor.js';
import 'ft-document-panel/ft-document-panel-settings-behavior.js';
import 'ft-form-panel/ft-form-panel.js';
import 'ft-source-panel/demo/ft-source-panel-settings-editor.js';
import 'ft-source-panel/ft-source-panel-settings-behavior.js';
import 'ft-source-grid-item/demo/ft-source-grid-item-settings-editor.js';
import 'ft-source-grid-item/ft-source-grid-item-settings-behavior.js';
import 'ft-styler/ft-styler.js';
import '@webcomponents/shadycss/entrypoints/apply-shim.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';
Polymer({
  _template: html`
        <style include="iron-flex iron-flex-alignment iron-positioning"></style>

        <style>
            :host {
                display: block;
                overflow: hidden;
                @apply --layout-vertical;
            }
        </style>

        <style>
            .form-panel
            {
                padding-left: 5px;
                padding-right: 15px;
                padding-bottom: 0px;
            }
            .section-divider
            {
                width: 100%;
                margin-bottom: 10px;
                height: 10px;
                border-bottom: 1px solid #DDD;
            }
        </style>

        <app-localstorage-document key="configurationPanel-configurationIsOpen" data="{{_configurationIsOpen}}">
        </app-localstorage-document>

        <app-localstorage-document key="configurationPanel-selectedConfigurationIndex" data="{{_selectedConfigurationIndex}}">
        </app-localstorage-document>

        <app-localstorage-document key="configurationPanel-settingsPanelOpen" data="{{_settingsPanelOpen}}">
        </app-localstorage-document>

        <app-localstorage-document key="configurationPanel-stylingPanelOpen" data="{{_stylingPanelOpen}}">
        </app-localstorage-document>

        <ft-accordion-item heading="Config" is-open="{{_configurationIsOpen}}" class="flex">
            <div slot="content" class="flex layout vertical">
                <!-- Web component menu and repo button -->
                <div class="layout horizontal center" style="
                        padding-left: 20px;
                        padding-right: 15px;
                        padding-bottom: 0;
                    ">
                    <!-- Web component menu -->
                    <paper-dropdown-menu id="configurationMenu" label="Web Component" style="width:200px; margin-bottom: 0; " no-animations="true">
                        <paper-listbox class="dropdown-content" slot="dropdown-content" selected="{{_selectedConfigurationIndex}}">
                            <template is="dom-repeat" items="[[configurations]]" as="configuration">
                                <paper-item>[[configuration.label]]</paper-item>
                            </template>
                        </paper-listbox>
                    </paper-dropdown-menu>

                    <!-- GitHub repository button -->
                    <ft-labeled-icon-button style="padding-left:20px; " icon-src="./src/github.svg" label="Repo" on-tap="_onSourcesButtonTapped">
                    </ft-labeled-icon-button>
                </div>

                <!-- Divider -->
                <div class="section-divider"></div>

                <!-- Settings panel -->
                <ft-form-panel heading="Settings" class="form-panel" content-shown="{{_settingsPanelOpen}}">
                    <!-- Summary -->
                    <div slot="summary" style="font-family:'Roboto', sans-serif; font-size: 9pt; padding-top: 4px; color: #AAA; ">
                        [[_secretsShownText]]
                    </div>

                    <!-- Defaults button -->
                    <ft-labeled-icon-button id="settingsDefaultsButton" slot="controls" icon="undo" label="Default" disabled="[[!_canSetDefaultSettings]]" on-tap="_onSettingsDefaultButtonClicked">
                    </ft-labeled-icon-button>

                    <!-- Content -->
                    <div slot="content" class="layout horizontal center" style="margin-top: 12px;">
                        <iron-pages id="configurationEditors" class="flex layout vertical" attr-for-selected="name" selected="[[_selectedConfigurationName]]">
                            <ft-connect-wizard-settings-editor id="connectWizardSettingsEditor" name="ft-connect-wizard" ft-connect-wizard-show-documents-panel="{{ftConnectWizardShowDocumentsPanel}}" ft-connect-wizard-show-document-count-badge="{{ftConnectWizardShowDocumentCountBadge}}">
                            </ft-connect-wizard-settings-editor>

                            <ft-connection-panel-settings-editor id="connectionPanelSettingsEditor" name="ft-connection-panel" ft-connection-panel-show-heading="{{ftConnectionPanelShowHeading}}" ft-connection-panel-heading="{{ftConnectionPanelHeading}}" ft-connection-panel-show-delete-button="{{ftConnectionPanelShowDeleteButton}}" ft-connection-show-details-panel="{{ftConnectionShowDetailsPanel}}">
                            </ft-connection-panel-settings-editor>

                            <ft-connection-list-item-settings-editor id="connectionListItemSettingsEditor" name="ft-connection-list-item" ft-connection-list-item-allow-manual-fetch="{{ftConnectionListItemAllowManualFetch}}" ft-connection-list-item-show-document-count="{{ftConnectionListItemShowDocumentCount}}">
                            </ft-connection-list-item-settings-editor>

                            <ft-document-panel-settings-editor id="documentPanelSettingsEditor" name="ft-document-panel" ft-document-panel-show-heading="{{ftDocumentPanelShowHeading}}" ft-document-panel-heading="{{ftDocumentPanelHeading}}" ft-document-panel-show-grid-button="{{ftDocumentPanelShowGridButton}}" ft-document-panel-show-list-button="{{ftDocumentPanelShowListButton}}" ft-document-panel-view-as-initial="{{ftDocumentPanelViewAsInitial}}" ft-document-panel-show-preview-button="{{ftDocumentPanelShowPreviewButton}}" ft-document-panel-show-upload-button="{{ftDocumentPanelShowUploadButton}}" ft-document-panel-show-download-button="{{ftDocumentPanelShowDownloadButton}}" ft-document-panel-show-delete-button="{{ftDocumentPanelShowDeleteButton}}" ft-document-panel-show-document-count="{{ftDocumentPanelShowDocumentCount}}">
                            </ft-document-panel-settings-editor>

                            <ft-source-panel-settings-editor id="sourcePanelSettingsEditor" name="ft-source-panel" ft-source-panel-filters="{{ftSourcePanelFilters}}" ft-source-panel-show-filters="{{ftSourcePanelShowFilters}}" ft-source-panel-heading="{{ftSourcePanelHeading}}" ft-source-panel-show-heading="{{ftSourcePanelShowHeading}}" ft-source-panel-show-search-field="{{ftSourcePanelShowSearchField}}">
                            </ft-source-panel-settings-editor>

                            <!--<ft-source-grid-item-settings-editor>-->
                            <!--</ft-source-grid-item-settings-editor>-->

                        </iron-pages>

                    </div>
                </ft-form-panel>

                <!-- Divider -->
                <!--<div class="section-divider"></div>-->

                <!-- Styling panel -->
                <!--<ft-form-panel-->
                    <!--heading="Styling"-->
                    <!--class="form-panel"-->
                    <!--content-shown={{_stylingPanelOpen}}-->
                <!--&gt;-->
                    <!--&lt;!&ndash; Summary &ndash;&gt;-->
                    <!--<div-->
                        <!--slot="summary"-->
                        <!--style="font-family:'Roboto', sans-serif; font-size: 9pt; padding-top: 4px; color: #AAA; "-->
                    <!--&gt;-->
                        <!--[[_secretsShownText]]-->
                    <!--</div>-->

                    <!--&lt;!&ndash; Content &ndash;&gt;-->
                    <!--<div-->
                        <!--slot="content"-->
                        <!--class="layout horizontal center"-->
                        <!--style="margin-top: 12px;"-->
                    <!--&gt;-->
                        <!--<ft-styler-->
                            <!--style="border-right:1px solid black; "-->
                        <!--&gt;-->
                        <!--</ft-styler>-->
                    <!--</div>-->
                <!--</ft-form-panel>-->
            </div>
        </ft-accordion-item>
`,

  is: 'configuration-panel',

  behaviors: [
      FileThis.ConnectWizardSettingsBehavior,
      FileThis.ConnectionPanelSettingsBehavior,
      FileThis.ConnectionListItemSettingsBehavior,
      FileThis.DocumentPanelSettingsBehavior,
      FileThis.SourceGridItemSettingsBehavior,
      FileThis.SourcePanelSettingsBehavior,
  ],

  properties:
      {
          configurations:{
              type: Array,
              notify: true,
              value: [],
          },

          _selectedConfigurationIndex:
              {
                  type: Number,
                  value: 0,
                  observer: "_onSelectedConfigurationIndexChanged",
              },

          selectedConfiguration:
              {
                  type: Object,
                  value: null,
                  notify: true,
              },

          _selectedConfigurationName:
              {
                  type: Object,
                  value: null,
              },

          _configurationIsOpen:
              {
                  type: Boolean,
                  value: true,
              },

          _settingsPanelOpen:
              {
                  type: Object,
                  notify: true,
                  value: true,
              },
          _stylingPanelOpen:
              {
                  type: Object,
                  notify: true,
                  value: false,
              },

          _canSetDefaultSettings: {
              type: Boolean,
              value: false
          },
      },

  // Startup -------------------------------------------------------------------------------------

  ready: function()
  {
      this.async(function()
      {
          // We have to be careful here to make sure that removed panels whose names have been stored
          // by a client get mapped to an actual panel.
          var panelName = this._readFromLocalStorage(this.localName + "selectedConfigurationPanelTabName", this._defaultPanelName);
          if (!this._isValidPanelName(panelName))
              panelName = this._defaultPanelName;

          this._selectedConfigurationPanelTabName = panelName;
      });

      this.configurations.forEach(function(configuration)
      {
          var settingsEditor;
          switch (configuration.name)
          {
              case "ft-connect-wizard":
                  settingsEditor = this.$.connectWizardSettingsEditor;
                  break;
              case "ft-connection-list-item":
                  settingsEditor = this.$.connectionPanelSettingsEditor;
                  break;
              case "ft-connection-panel":
                  settingsEditor = this.$.connectionListItemSettingsEditor;
                  break;
              case "ft-document-panel":
                  settingsEditor = this.$.documentPanelSettingsEditor;
                  break;
              case "ft-source-panel":
                  settingsEditor = this.$.sourcePanelSettingsEditor;
                  break;
              case "ft-source-grid-item":
                  settingsEditor = this.$.sourceGridSettingsEditor;
                  break;
              default:
                  settingsEditor = null;
                  break;
          }
          configuration.settingsEditor = settingsEditor;
      }.bind(this));
  },

  _findElementWithId: function(id)
  {
      // TODO: There must be a better way to do this...
      var fakeViewport = this.$.fakeViewport;
      var children = dom(fakeViewport).getEffectiveChildNodes();
      var count = children.length;
      for (var index = 0;
           index < count;
           index++)
      {
          var child = children[index];
          if (child.id === id)
              return child;
      }
      return null;
  },

  updateSettingsDefaultButtonEnabled: function()
  {
      var selectedConfiguration = this.selectedConfiguration;
      if (!selectedConfiguration)
          return;
      var settingsEditor = selectedConfiguration.settingsEditor;
      var enableButton = settingsEditor.hasSettings();
      this._canSetDefaultSettings = enableButton;
  },

  _onSelectedConfigurationIndexChanged: function(to, from)
  {
      var selectedConfigurationIndex = this._selectedConfigurationIndex;
      if (selectedConfigurationIndex === null)
          return;
      if (selectedConfigurationIndex === undefined)
          return;
      var configurations = this.configurations;
      if (configurations.length === 0)
          return;
      var selectedConfiguration = configurations[selectedConfigurationIndex];
      this.selectedConfiguration = selectedConfiguration;

      this._selectedConfigurationName = selectedConfiguration.name;
  },

  _onSettingsDefaultButtonClicked: function(event)
  {
      var settingsEditor = this.selectedConfiguration.settingsEditor;
      settingsEditor.revertToDefaults();
  },

  _onSourcesButtonTapped: function(event)
  {
      var url =
          "https://github.com/filethis/" +
          this._selectedConfigurationName +
          "/blob/master/" +
          this._selectedConfigurationName + ".html";
      this._openUrl(url);
  },

  _openUrl: function(url)
  {
      var win = window.open(url, '_blank');
      if (win)
          win.focus();
      else
          this.$.confirmationDialog.alert("Please allow popups for this site");
  },

  // User action event handling --------------------------------------------------------------------------

  _onPanelSelected: function()
  {
      localStorage.setItem(this.localName + "selectedConfigurationPanelTabName", this._selectedConfigurationPanelTabName);
  },

  _isValidPanelName: function(panelName)
  {
      switch (panelName)
      {
          case "token":
              return true;
      }
      return false;
  },

  // Local storage ----------------------------------------------------------------------------

  _readFromLocalStorage: function(name, defaultValue)
  {
      var value = localStorage.getItem(name);
      if (value === null)
          value = defaultValue;
      return value;
  },

  _readFromLocalStorageBoolean: function(name, defaultValue)
  {
      var value = localStorage.getItem(name);
      if (value === null)
          value = defaultValue;
      return JSON.parse(value);
  }
})
