/********************************************************************************
 * Copyright (C) 2018 Red Hat, Inc. and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/
import { injectable, inject } from 'inversify';
import {FrontendApplicationContribution, StatusBar, StatusBarAlignment } from '@theia/core/lib/browser';
import { ISCMService} from '../common/scm';
import {Command} from '@theia/core';

@injectable()
export class ScmContribution implements FrontendApplicationContribution {
    @inject(StatusBar) protected readonly statusBar: StatusBar;
    @inject(ISCMService) protected readonly scmService: ISCMService;
    onStart(): void {
        this.scmService.repositories.forEach(repository => {
            const handler = repository.provider.onDidChangeStatusBarCommands;
            if (handler) {
                handler(commands => this.onCommand(commands));
            }
        });
        this.scmService.onDidAddRepository(repository => {
            const handler = repository.provider.onDidChangeStatusBarCommands;
            if (handler) {
                handler(commands => this.onCommand(commands));
            }
        });
    }
    onCommand(commands: Command[]): void {
        commands.forEach(command => {
            this.statusBar.setElement(command.id, {
                text: command.label ? command.label : '',
                alignment: StatusBarAlignment.LEFT,
                priority: 102,
                command: command.id,
                tooltip: command.category
            });
        });
    }
}
